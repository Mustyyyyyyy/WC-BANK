function generateReference(prefix = "WC") {
  const now = Date.now();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${now}-${rand}`;
}

module.exports = generateReference;