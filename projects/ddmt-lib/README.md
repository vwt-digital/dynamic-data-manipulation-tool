# DDMT-lib

This package creates an AG-grid that is dynamically generated based on an OpenAPI specification and a few component inputs.

When installing the package please make sure to also install the peerDependencies since
they are not installed automatically.

## Setup
After installing you'll also need to set the ag-grid theme you wish to use and the color of the buttons.

The color of the buttons can be set using a css variable named `ddmt-theme-color`.
The ag-grid theme can be provided by importing the css file into your `styles.scss` and providing the name of the theme using the `theme` input.

#### Example
```scss
// styles.scss

// Required
@import "~ag-grid-community/dist/styles/ag-grid.css";

// Import one of the css themes of ag-grid
@import "~ag-grid-community/dist/styles/ag-theme-balham.css"; // One of the many themes

// Set the button colors.
:root {
  --ddmt-theme-color: #008bb8;
}
```

In your angular module add the following:
```typescript
...

import { DDMTLibModule } from '@vwt-digital/ddmt-lib';

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...,
    DDMTLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

And in your html:
```html
<dat-ddmt-grid
  theme="ag-theme-balham"
  [authentication]="authentication"
  [apiUrl]="apiUrl"
  [entityName]="entityName"
  [agGridAPIKey]="apiKey"
  gridName="test">
</dat-ddmt-grid>
```

## Example
For more information please clone the repo and run it using `ng serve` to see an example project.
