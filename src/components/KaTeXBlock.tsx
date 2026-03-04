import katex from 'katex';
import 'katex/dist/katex.min.css';

interface KatexBlockProps {
  math: string;
  displayMode?: boolean;
}

const KatexBlock: React.FC<KatexBlockProps> = ({ math, displayMode = true }) => {
  const html = katex.renderToString(math, {
    throwOnError: false,
    displayMode,
  });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export default KatexBlock;