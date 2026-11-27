${RELEASE_NOTES}

${PACKAGE_README}

## **Package Links**

### ▪️ NPM Registry

- https://www.npmjs.com/package/${PACKAGE_NAME}/v/${PROJECT_VERSION}

### ▪️ JSR (JavaScript Registry)

- https://jsr.io/${PACKAGE_NAME}/${PROJECT_VERSION}

### ▪️ Unpkg CDN

- _**ESM**_: `https://unpkg.com/${PACKAGE_NAME}@${PROJECT_VERSION}/dist/${PROJECT_NAME}.esm.js`
- _**UMD**_: `https://unpkg.com/${PACKAGE_NAME}@${PROJECT_VERSION}/dist/${PROJECT_NAME}.js`

* _**ESM Minified**_: `https://unpkg.com/${PACKAGE_NAME}@${PROJECT_VERSION}/dist/${PROJECT_NAME}.esm.min.js`
* _**UMD Minified**_: `https://unpkg.com/${PACKAGE_NAME}@${PROJECT_VERSION}/dist/${PROJECT_NAME}.min.js`

### ▪️ jsDelivr CDN

- _**ESM**_: `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PROJECT_VERSION}/dist/${PROJECT_NAME}.esm.js`
- _**UMD**_: `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PROJECT_VERSION}/dist/${PROJECT_NAME}.js`
- _**ESM Minified**_: `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PROJECT_VERSION}/dist/${PROJECT_NAME}.esm.min.js`
- _**UMD Minified**_: `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PROJECT_VERSION}/dist/${PROJECT_NAME}.min.js`

## Usage

### UMD (Browser)

UMD will auto-load `${PROJECT_NAME}` into the global scope `window.*`

```html
<script src="https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PROJECT_VERSION}/dist/${PROJECT_NAME}.js"></script>
```

### ESM (Module)

ESM can be imported into your JavaScript/TypeScript projects as follows:

```javascript
import * as packageModule from 'https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PROJECT_VERSION}/dist/${PROJECT_NAME}.esm.js';
```
