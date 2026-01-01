export function parseOrderBy(orderBy?: string[]) {
  if (!orderBy) return undefined;

  return orderBy.map((param) => {
    const sortOrder = param.charAt(0) === '-' ? 'desc' : 'asc';
    const formatedParam = param.charAt(0) === '-' ? param.slice(1) : param;
    return {
      [formatedParam]: sortOrder,
    };
  });
}
