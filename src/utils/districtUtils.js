// District Matching and Helper Utilities for Tamil Nadu NGO Connect

export const matchDistrict = (itemDistrict, targetDistrict) => {
  if (!targetDistrict || targetDistrict === 'All Districts' || targetDistrict === 'All') return true;
  if (!itemDistrict) return false;
  if (itemDistrict === 'All Districts' || itemDistrict === 'All') return true;

  const normItem = itemDistrict.toLowerCase().trim();
  const normTarget = targetDistrict.toLowerCase().trim();

  if (normItem === normTarget) return true;

  // Known spelling variants for Tamil Nadu districts
  const variants = [
    ['tiruchirappalli', 'trichy', 'tiruchirapalli'],
    ['kanyakumari', 'kanniyakumari'],
    ['thiruvarur', 'tiruvarur'],
    ['thoothukudi', 'tuticorin', 'thoothukudi (tuticorin)'],
    ['chengalpattu', 'chengalpet'],
    ['tirunelveli', 'nellai']
  ];

  for (const group of variants) {
    const targetInGroup = group.some(v => normTarget.includes(v) || v.includes(normTarget));
    const itemInGroup = group.some(v => normItem.includes(v) || v.includes(normItem));
    if (targetInGroup && itemInGroup) return true;
  }

  return normItem.includes(normTarget) || normTarget.includes(normItem);
};
