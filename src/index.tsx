export default ({ comp, items }: Lume.Data, { url }: Lume.Helpers) => {
  return (
    <>
      <comp.Drawer
        prefix="gbrlgrct.com/"
        items={Object.entries(items).map((
          [name, { timestamp, description }],
        ) => ({
          name,
          url: url("./" + name),
          date: timestamp ? new Date(timestamp) : undefined,
          description: description,
        }))}
      />
    </>
  );
};
