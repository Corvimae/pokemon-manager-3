import styled from 'styled-components';
import { DropdownTooltip } from "./DropdownTooltip";
import { TypeIndicator } from "./TypeIndicator";
import { useCallback, useState } from "react";
import { useTypedSelector } from '../store/rootReducer';

interface TypeSelectorProps {
  value: string;
  onSelect: (id: number, name: string) => void;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({ onSelect, value }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const editMode = useTypedSelector(state => state.pokemon.editMode);
  const typeIds = useTypedSelector(state => state.pokemon.typeIds);

  const toggleShowDropdown = useCallback((event: Event) => {
    event.stopPropagation();

    if (editMode) {
      setShowDropdown(!showDropdown);
    }
  }, [editMode, showDropdown]);

  const handleSelection = useCallback((name: string) => {
    onSelect(typeIds[name], name);
    setShowDropdown(false);
  }, [typeIds]);

  return (
    <Container>
      <TypeIndicator name={value} onClick={toggleShowDropdown} disabled={!editMode} icon />
      <DropdownTooltip visible={editMode && showDropdown} onVisibilityChange={setShowDropdown}>
        <TypeSelectorList>
          {Object.keys(typeIds).map(typeName => (
            <TypeIndicator key={typeName} name={typeName} onClick={() => handleSelection(typeName)} icon />
          ))}
        </TypeSelectorList>
      </DropdownTooltip>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const TypeSelectorList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, max-content);
  grid-gap: 0.25rem;
`;
