import MarkdownRenderer from "../utils/MarkdownRenderer";

interface ListElement {
  id: string;
  title: string;
  content: string;
}

interface ListProps {
  data: {
    id: string;
    listElement: ListElement[];
  };
}

export default function List({ data }: ListProps) {
  return (
    <>
      <div className="container grid grid-cols-1 mx-auto mt-5 space-y-4 max-w-3xl lg:text-left">
        {data.listElement.map((item) => (
          <ul key={item.id}>
            <li className="list-inside align-baseline list-check">
              <span className="text-2xl font-bold text-left text-black">
                {item.title}
              </span>
              <MarkdownRenderer text={item.content} />
            </li>
          </ul>
        ))}
      </div>
    </>
  );
}
