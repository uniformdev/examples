# Custom parameter showcase

Next.js app router project that showcases custom parameters that must be installed in the team.

## Pre-requisites

1. Uniform account with an empty project.
1. Install the following custom integration in your team:

```json
{
  "type": "canvas-extensions",
  "displayName": "Canvas Extensions",
  "logoIconUrl": "https://theme-pack.mesh.uniform.app/badge.svg",
  "badgeIconUrl": "https://theme-pack.mesh.uniform.app/badge.svg",
  "category": "starters",
  "baseLocationUrl": "https://canvas-extensions.mesh.uniform.app",
  "locations": {
    "install": {
      "description": [
        "This integration installs new custom parameters for components allowing to control visual display and layout settings more effectively."
      ]
    },
    "settings": {
      "url": "/settings"
    },
    "canvas": {
     "parameterTypes": [
        {
          "type": "tp-direction-parameter",
          "displayName": "Custom Direction",
          "configureUrl": "/config?showViewPortToggle=true",
          "editorUrl": "/editor",
          "renderableInPropertyPanel": true
        },
        {
          "type": "tp-slider-parameter",
          "displayName": "Custom Slider",
          "configureUrl": "/config/slider-param?showViewPortToggle=true",
          "editorUrl": "/editor",
          "renderableInPropertyPanel": true
        },
        {
          "type": "tp-segmented-control-parameter",
          "displayName": "Custom Segmented Control",
          "configureUrl": "/config/segmented-control?showViewPortToggle=true",
          "editorUrl": "/editor",
          "renderableInPropertyPanel": true
        },
        {
          "type": "tp-space-control-parameter",
          "displayName": "Custom Space Control",
          "configureUrl": "/config/space-control?showViewPortToggle=true",
          "editorUrl": "/editor",
          "renderableInPropertyPanel": true
        }
      ]
    }
  }
}
```

## Getting Started

1. Install dependencies with `npm install`
1. Change the API key and Project ID env vars in `.env` with your own.
    > Make sure your API key has "Developer" role to be able to push content.
2. `npm run uniform:push` to push content from disk (`/uniform-data` folder) to your project. 
3. Run the development server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.