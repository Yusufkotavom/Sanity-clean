import FeaturesPackageBlock from "./features-package-block";
import type { ColorVariant, SectionPadding } from "@/sanity.types";

type Props = {
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  title?: string | null;
  description?: string | null;
  valueProps?: Array<{ _key?: string; icon?: string; title?: string; description?: string }> | null;
};

export default function ValuePropsBlock({ padding, colorVariant, title, description, valueProps }: Props) {
  return (
    <FeaturesPackageBlock
      padding={padding}
      colorVariant={colorVariant}
      cardStyle="list"
      title={title}
      description={description}
      features={valueProps?.map((item) => ({ _key: item._key, title: item.title, description: item.description }))}
    />
  );
}
