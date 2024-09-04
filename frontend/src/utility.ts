export const join = (...args: string[]) => args.join(" ");

export function debounce<TArgs>(
  func: (...args: TArgs[]) => void,
  wait: number = 0
): (...args: TArgs[]) => void {
  let timer: number | null = null;

  return (...args: TArgs[]) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => func(...args), wait);
  };
}

export const fetchUrl = async (url: string, query?: string) => {
  console.log("Called API");
  const response = await fetch(url);
  const data = await response.json();

  if (query) {
    return data
      .filter((entry: any) => entry.role.includes(query))
      .map((entry: any) => entry.role);
  }

  return data.map((entry: any) => entry.role);
};
