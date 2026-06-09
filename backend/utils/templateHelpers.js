const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const wrapHTML = ({
  title,
  primaryColor,
  accentColor,
  styles,
  body,
  scripts = "",
}) => `
<!DOCTYPE html>
<html>
<head>
<title>${escapeHtml(title)}</title>
<style>
${styles}
</style>
</head>
<body>
${body}
<script>
${scripts}
</script>
</body>
</html>
`;

module.exports = {
  wrapHTML,
  escapeHtml,
};