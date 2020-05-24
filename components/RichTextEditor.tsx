import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import { Editor, Transforms, createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faCode, faHeading, faQuoteLeft, faListOl, faListUl } from '@fortawesome/free-solid-svg-icons';
import { Button as LayoutButton } from './Layout';
import { Theme } from '../utils/theme';


const BLANK_SLATE_VALUE = [{ type: 'paragraph', children: [{ text: '' }] }];

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

interface RichTextEditorProps {
  defaultValue: string;
  onSave: (value: string) => void;
}

function safelyParseJSON(value: string): Node[] {
  try {
    return (JSON.parse(value) || BLANK_SLATE_VALUE) as Node[];
  } catch {
    return BLANK_SLATE_VALUE;
  }
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ defaultValue, onSave }) => {
  const [value, setValue] = useState<Node[]>(safelyParseJSON(defaultValue));
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const handleSave = useCallback(() => {
    onSave(JSON.stringify(value));
  }, [onSave, value]);

  const handleKeyDown = useCallback(event => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault();
        toggleMark(editor, HOTKEYS[hotkey]);
      }
    }

    if (isHotkey(['mod+s', 'save'], event as any)) handleSave();
  }, [handleSave]);

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <EditorContainer>
        <Toolbar>
          <MarkButton format="bold" icon={faBold} />
          <MarkButton format="italic" icon={faItalic} />
          <MarkButton format="underline" icon={faUnderline} />
          <MarkButton format="code" icon={faCode} />
          <BlockButton format="heading-one" icon={faHeading} />
          <BlockButton format="block-quote" icon={faQuoteLeft} />
          <BlockButton format="numbered-list" icon={faListOl} />
          <BlockButton format="bulleted-list" icon={faListUl} />
          <SaveButton onClick={handleSave}>Save</SaveButton>
        </Toolbar>
        <EditableContainer>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            spellCheck
            autoFocus
            onKeyDown={handleKeyDown}
          />
        </EditableContainer>
      </EditorContainer>
    </Slate>
  );
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

const isBlockActive = (editor, format) => {
  return !!(Editor.nodes(editor, {
    match: n => n.type === format,
  })[0]);
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();

  const handleMouseDown = useCallback(event => {
    event.preventDefault();
    toggleBlock(editor, format);
  }, []);

  return (
    <Button active={isBlockActive(editor, format)} onMouseDown={handleMouseDown} hideForMobile>
      <FontAwesomeIcon icon={icon} fixedWidth />
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();

  const handleMouseDown = useCallback(event => {
    event.preventDefault();
    toggleMark(editor, format);
  }, []);

  return (
    <Button active={isMarkActive(editor, format)} onMouseDown={handleMouseDown}>
      <FontAwesomeIcon icon={icon} fixedWidth />
    </Button>
  );
}


const Button = styled.span`
  cursor: pointer;
  
  & svg {
    color: ${({ reversed, active }) => reversed ? (active ? '#fff' : '#aaa') : (active ? '#000' : '#ccc')};
  }

  & + & {
    margin-left: 1rem;
  }

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    display: ${({ hideForMobile }) => hideForMobile && 'none'};
  }
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: row;
  padding: 0.25rem 0.5rem;
  border-bottom: 2px solid #eee;
  margin-bottom: 0.5rem;
`;

const EditableContainer = styled.div`
  min-height: 0;
  max-height: 80vh;
  padding: 0.25rem 0.5rem;
  overflow-y: scroll;
  align-self: stretch;
  flex-grow: 1;

  & > div > p:first-child {
    margin-top: 0;
  }
`;

const SaveButton = styled(LayoutButton)`
  width: max-content;
  margin-left: auto;
  line-height: 1;
  padding: 0.25rem 1rem;
`;