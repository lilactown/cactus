rm -f component.d.ts
rm -f connectedView.js
rm -f core.d.ts
rm -f core.js
rm -f createAppComponent.d.ts
rm -f createAppComponent.js
rm -rf drivers
tsc
mv dist/* .
rm -rf dist
