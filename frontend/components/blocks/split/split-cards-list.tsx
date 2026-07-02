import SplitCardsItem from "@/components/blocks/split/split-cards-item";
import { PAGE_QUERY_RESULT,  } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type SplitRow = Extract<Block, { _type: "split-row" }>;
type SplitCardsList = Extract<
  NonNullable<SplitRow["splitColumns"]>[number],
  { _type: "split-cards-list" }
>;

interface SplitCardsListProps extends SplitCardsList {
}

export default function SplitCardsList({  list }: SplitCardsListProps) {
  return (
    <div className="flex flex-col justify-center gap-4">
      {list &&
        list.length > 0 &&
        list.map((item) => (
          <SplitCardsItem
            key={item._key}
            {...item}
          />
        ))}
    </div>
  );
}
