const getTime = ({ time }: { time: string | Date }) => {
  return new Date(time).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export { getTime };
