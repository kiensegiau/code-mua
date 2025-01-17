export const getNumberFromTitle = (text = "") => {
  const match = text.match(/(?:^|\.)?\s*(\d+)/);
  return match ? parseInt(match[1]) : 999999;
};

export const sortByTitle = (a, b) => {
  const numA = getNumberFromTitle(a.title);
  const numB = getNumberFromTitle(b.title);
  return numA - numB;
};

export const sortByName = (a, b) => {
  const numA = getNumberFromTitle(a.name);
  const numB = getNumberFromTitle(b.name);
  return numA - numB;
}; 