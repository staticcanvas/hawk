#requires -Version 7.0
<#
.SYNOPSIS
    Finds repos in your GitHub user account created within the last N months
    and prompts for confirmation before deleting each one.

.DESCRIPTION
    Built for cleaning up after a mirror tool accidentally fans repos into
    user space instead of an org/group. Lists candidates first, then walks
    through them one at a time with an explicit confirmation prompt before
    any DELETE call is made. Nothing is deleted silently.

.PARAMETER Token
    GitHub Personal Access Token. Needs 'delete_repo' scope (classic PAT)
    or Administration: read/write (fine-grained PAT). Falls back to
    $env:GITHUB_TOKEN if not supplied.

.PARAMETER MonthsBack
    How far back to look, based on repo 'created_at'. Default 2.

.PARAMETER NamePattern
    Optional extra safety filter — only consider repos whose name matches
    this wildcard/regex-ish pattern (e.g. '*mirror*'). Highly recommended
    when you know the mirror tool's naming convention.

.PARAMETER DryRun
    List matching repos and exit. No prompts, no deletes. Always run this
    first.

.PARAMETER Force
    Skip the per-repo confirmation prompt. NOT recommended — defeats the
    point of this script. Provided for scripted/CI use only, guarded by
    an explicit acknowledgement prompt at start.

.EXAMPLE
    ./Remove-RecentGitHubRepos.ps1 -DryRun

.EXAMPLE
    ./Remove-RecentGitHubRepos.ps1 -NamePattern '*mirror*'
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$Token = $env:GITHUB_TOKEN,
    [int]$MonthsBack = 2,
    [string]$NamePattern,
    [switch]$DryRun,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

if (-not $Token) {
    throw "No token supplied. Pass -Token or set `$env:GITHUB_TOKEN`. Needs 'delete_repo' scope."
}

# Defensive trim — a stray trailing newline/space from copy-paste (common with
# CRLF .env files or clipboard artifacts) silently breaks the header and
# produces a generic 401 with no useful clue as to why.
$Token = $Token.Trim()

$headers = @{
    Authorization          = "Bearer $Token"
    Accept                 = 'application/vnd.github+json'
    'X-GitHub-Api-Version' = '2022-11-28'
}

# --- resolve authenticated user (also validates the token early) ---
try {
    $me = Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers $headers -Method Get
}
catch {
    $body = $null
    if ($_.ErrorDetails.Message) {
        $body = $_.ErrorDetails.Message
    }
    elseif ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = [System.IO.StreamReader]::new($stream)
            $body = $reader.ReadToEnd()
        } catch { }
    }
    Write-Host "Token length after trim: $($Token.Length) chars" -ForegroundColor DarkGray
    if ($body) { Write-Host "GitHub response body: $body" -ForegroundColor DarkGray }
    throw "Token validation failed: $($_.Exception.Message)"
}
Write-Host "Authenticated as: $($me.login)" -ForegroundColor Cyan

$cutoff = (Get-Date).AddMonths(-$MonthsBack)
Write-Host "Cutoff date (created after): $($cutoff.ToString('yyyy-MM-dd'))" -ForegroundColor Cyan

# --- page through all repos owned by the authenticated user ---
$allRepos = [System.Collections.Generic.List[object]]::new()
$page = 1
do {
    $uri = "https://api.github.com/user/repos?per_page=100&page=$page&affiliation=owner&sort=created&direction=desc"
    $batch = Invoke-RestMethod -Uri $uri -Headers $headers -Method Get
    foreach ($r in $batch) { $allRepos.Add($r) }
    $page++
} while ($batch.Count -eq 100)

Write-Host "Total repos owned by $($me.login): $($allRepos.Count)" -ForegroundColor Cyan

# --- filter: created within window ---
$candidates = $allRepos | Where-Object { [datetime]$_.created_at -ge $cutoff }

# --- optional extra filter: name pattern ---
if ($NamePattern) {
    $candidates = $candidates | Where-Object { $_.name -like $NamePattern }
    Write-Host "Filtered by name pattern '$NamePattern'" -ForegroundColor Cyan
}

if (-not $candidates -or $candidates.Count -eq 0) {
    Write-Host "No repos match the criteria. Nothing to do." -ForegroundColor Green
    return
}

Write-Host "`nMatching repos ($($candidates.Count)):" -ForegroundColor Yellow
$candidates |
    Select-Object @{n = 'Name'; e = { $_.full_name } },
                  @{n = 'Created'; e = { ([datetime]$_.created_at).ToString('yyyy-MM-dd') } },
                  @{n = 'Private'; e = { $_.private } },
                  @{n = 'URL'; e = { $_.html_url } } |
    Format-Table -AutoSize

if ($DryRun) {
    Write-Host "`n-DryRun set — no deletions performed." -ForegroundColor Green
    return
}

if ($Force) {
    Write-Host "`n-Force set: per-repo prompts will be skipped." -ForegroundColor Red
    $ack = Read-Host "Type the literal word DELETE-ALL to proceed without individual confirmation"
    if ($ack -ne 'DELETE-ALL') {
        Write-Host "Acknowledgement not given. Aborting." -ForegroundColor Yellow
        return
    }
}

$deleted = [System.Collections.Generic.List[string]]::new()
$skipped = [System.Collections.Generic.List[string]]::new()

foreach ($repo in $candidates) {
    $full = $repo.full_name
    $created = ([datetime]$repo.created_at).ToString('yyyy-MM-dd')

    if (-not $Force) {
        Write-Host "`n---" -ForegroundColor DarkGray
        Write-Host "Repo:    $full"
        Write-Host "Created: $created"
        Write-Host "Private: $($repo.private)"
        Write-Host "URL:     $($repo.html_url)"

        $choice = $Host.UI.PromptForChoice(
            "Delete this repository?",
            "This cannot be undone.",
            @(
                [System.Management.Automation.Host.ChoiceDescription]::new('&Yes', 'Delete this repo')
                [System.Management.Automation.Host.ChoiceDescription]::new('&No', 'Skip this repo')
                [System.Management.Automation.Host.ChoiceDescription]::new('&Quit', 'Stop the script entirely')
            ),
            1
        )

        if ($choice -eq 2) {
            Write-Host "Quitting at user request." -ForegroundColor Yellow
            break
        }
        if ($choice -eq 1) {
            Write-Host "Skipped: $full" -ForegroundColor DarkYellow
            $skipped.Add($full)
            continue
        }
    }

    if ($PSCmdlet.ShouldProcess($full, "Delete GitHub repository")) {
        try {
            Invoke-RestMethod -Uri "https://api.github.com/repos/$full" -Headers $headers -Method Delete
            Write-Host "Deleted: $full" -ForegroundColor Red
            $deleted.Add($full)
        }
        catch {
            Write-Host "FAILED to delete $full : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Deleted ($($deleted.Count)):"
$deleted | ForEach-Object { Write-Host "  - $_" }
Write-Host "Skipped ($($skipped.Count)):"
$skipped | ForEach-Object { Write-Host "  - $_" }
