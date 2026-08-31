const svgs = import.meta.glob('./symbols/*.svg', { 
  eager: true,
  query: '?raw',
  import: 'default'
})
function extractPath(svgRaw) {
  return svgRaw.match(/<path.*\/>/s)[0]
}
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
const symbols = {}
for (const [key, value] of Object.entries(svgs)) {
  const newKey = snakeToCamel(key.split("/").at(-1).split(".")[0])


  symbols[newKey] = extractPath(value)
}
export default symbols
