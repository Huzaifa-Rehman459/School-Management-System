async function generateId(Model, fieldName, prefix) {
  const year = new Date().getFullYear();
  const count = await Model.countDocuments({
    [fieldName]: { $regex: `^${prefix}-${year}-` },
  });
  const nextNumber = String(count + 1).padStart(3, "0");
  return `${prefix}-${year}-${nextNumber}`;
}

module.exports = generateId;
