import { type HTMLStyledProps, styled } from 'leather-styles/jsx';

export function HomeSection(props: HTMLStyledProps<'section'>) {
  return <styled.section mt={['space.10', 'space.10', '160px']} {...props} />;
}

interface HomeSectionTitleProps extends HTMLStyledProps<'h2'> {
  lines: string[];
}

export function HomeSectionTitle({ lines, ...props }: HomeSectionTitleProps) {
  return (
    <styled.h2
      textStyle={['heading.03', 'heading.03', 'heading.02']}
      color="ink.text-primary"
      {...props}
    >
      {lines.map(line => (
        <styled.span key={line} display="block">
          {line}
        </styled.span>
      ))}
    </styled.h2>
  );
}
