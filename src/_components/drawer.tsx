import moment from "npm:moment";

interface DrawerProps {
  prefix: string;
  items: Array<DrawerItem>;
  parent: DrawerItem;
}

interface DrawerItem {
  name: string;
  url: string;
  date?: Date;
  description?: string;
}

const nbsp = "\u00A0";

const Item = (
  { prefix, item, parent = false }: {
    prefix: string;
    item: DrawerItem;
    parent?: boolean;
  },
) => {
  return (
    <a class={`item ${parent && "parent"}`} href={item.url}>
      {`${parent ? nbsp : item.name}`}
      <span class="prefix">{parent ? item.name : prefix}</span>
      <div class="info" hidden={!item.date}>
        <time>{item.date && moment(item.date).format("MMM D, Y")}</time>
        <span>{item.description}</span>
      </div>
    </a>
  );
};

export default ({ prefix, items, parent }: DrawerProps) => {
  return (
    <div id="items">
      {parent && <Item prefix={prefix} item={parent} parent={true} />}
      {items.toSorted(compare).map((item) => (
        <Item prefix={prefix} item={item} />
      ))}
    </div>
  );
};

function compare(a: DrawerItem, b: DrawerItem) {
  if (a.date && b.date) {
    return b.date.getTime() - a.date.getTime();
  }
  return a.name.localeCompare(b.name);
}
