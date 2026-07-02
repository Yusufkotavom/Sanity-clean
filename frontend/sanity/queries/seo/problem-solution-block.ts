import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const problemSolutionBlockQuery = groq`
  _type == "problem-solution-block" => {
    _type,
    _key,
    blockStyles,
    title,
    problems[],
    solutionTitle,
    solution,
  }
`;
