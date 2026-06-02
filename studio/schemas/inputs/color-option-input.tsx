import { Box, Button, Card, Flex, Grid, Text } from "@sanity/ui";
import { set, unset, type StringInputProps } from "sanity";

type ColorListOption = {
  title?: string;
  value?: string;
};

function getColorOptions(props: StringInputProps): ColorListOption[] {
  const list = (props.schemaType.options as { list?: ColorListOption[] } | undefined)?.list;
  return Array.isArray(list) ? list : [];
}

function getSwatchStyle(value?: string) {
  if (!value) {
    return {
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(229,229,229,0.95))",
    };
  }

  return { backgroundColor: value };
}

export default function ColorOptionInput(props: StringInputProps) {
  const { value, onChange, readOnly } = props;
  const options = getColorOptions(props);

  return (
    <Grid columns={[1, 2, 2]} gap={2}>
      {options.map((option) => {
        const optionValue = option.value || "";
        const active = (value || "") === optionValue;

        return (
          <Card
            key={`${props.id}-${optionValue || "default"}`}
            border
            radius={2}
            padding={2}
            tone={active ? "primary" : "default"}
          >
            <Button
              mode="bleed"
              disabled={readOnly}
              onClick={() => onChange(optionValue ? set(optionValue) : unset())}
            >
              <Flex align="center" gap={3}>
                <Box
                  style={{
                    ...getSwatchStyle(option.value),
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    border: "1px solid rgba(0,0,0,0.12)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
                    flexShrink: 0,
                  }}
                />
                <Text size={1} weight="medium">
                  {option.title || "Untitled"}
                </Text>
              </Flex>
            </Button>
          </Card>
        );
      })}
    </Grid>
  );
}
