import { useState, useCallback, useMemo } from "react";
import styled from 'styled-components';
import { useDispatch } from "react-redux";
import { SortableContainer } from 'react-sortable-hoc';
import { addCapability } from "../store/pokemon";
import { Button, NumericInput, AddItemButton, DropdownHeader } from "./Layout";
import { CapabilityIndicator } from "./CapabilityIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { DefinitionLookahead } from "./DefinitionLookahead";
import { DropdownTooltip } from "./DropdownTooltip";
import { Theme } from "../utils/theme";
import { useTypedSelector } from "../store/rootReducer";

export const UnsortableCapabilityList: React.FC = () => {
  const dispatch = useDispatch();
  const pokemonId = useTypedSelector(store => store.pokemon.data.id);
  const capabilities = useTypedSelector(store => store.pokemon.data.capabilities);
  const editMode = useTypedSelector(state => state.pokemon.editMode);

  const [showCapabilityEditor, setShowCapabilityEditor] = useState(false);
  const [editorCapabilitySelection, setEditorCapabilitySelection] = useState(null);
  const [editorCapabilityValue, setEditorCapabilityValue] = useState(undefined);

  const sortedCapabilities = useMemo(() => (
    capabilities.sort((a, b) => a.PokemonCapability.sortOrder - b.PokemonCapability.sortOrder)
  ), [capabilities]);

  const toggleCapabilityEditor = useCallback((event: Event) => {
    event.stopPropagation();
    setShowCapabilityEditor(!showCapabilityEditor);
  }, [showCapabilityEditor]);

  const handleSubmit = useCallback(() => {
    dispatch(addCapability(
      pokemonId,
      editorCapabilitySelection.value,
      editorCapabilityValue || 0,
    ));
    setShowCapabilityEditor(false);
  }, [dispatch, pokemonId, editorCapabilitySelection, editorCapabilityValue]);
  
  const handleSetEditorCapabilityValue = useCallback(event => setEditorCapabilityValue(Number(event.target.value)), []);

  return (
    <Container>
      {sortedCapabilities.map((capability, index) => (
        <CapabilityIndicator key={capability.id} index={index} capability={capability} disabled={!editMode} />
      ))}
      {editMode && (
        <AddCapabilityContainer>
          <AddCapabilityButton onClick={toggleCapabilityEditor}>
            <FontAwesomeIcon icon={faPlus} size="sm" />
            &nbsp;Add Capability
          </AddCapabilityButton>

          {showCapabilityEditor && (
            <DropdownTooltip visible={showCapabilityEditor} onVisibilityChange={setShowCapabilityEditor}>
              <AddCapabilityDropdownContent>
                <DropdownHeader>Capability</DropdownHeader>
                <DropdownHeader>Value (optional)</DropdownHeader>
                <DropdownHeader/>
                <div>
                  <DefinitionLookahead
                    path='reference/capabilities'
                    onChange={setEditorCapabilitySelection}
                  />
                </div>
                <div>
                  <AddCapabilityValueInput onChange={handleSetEditorCapabilityValue} />
                </div>
                <div>
                  <AddCapabilitySubmitButton onClick={handleSubmit} disabled={editorCapabilitySelection === null}>
                    Add
                  </AddCapabilitySubmitButton>
                </div>
              </AddCapabilityDropdownContent>
            </DropdownTooltip>
          )}
        </AddCapabilityContainer>
      )}
    </Container>
  );
};

export const CapabilityList = SortableContainer(UnsortableCapabilityList);

const Container = styled.div`
  position: relative;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0.25rem;
  margin-top: 0.5rem;

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const AddCapabilityContainer = styled.div`
  position: relative;
  height: 1.75rem;
`;

const AddCapabilityDropdownContent = styled.div`
  display: grid;
  grid-template-columns: 15rem 8rem max-content;

  & > div {
    padding: 0 0.5rem;
  }
`;

const AddCapabilityValueInput = styled(NumericInput)`
  width: 100%;
`;

const AddCapabilitySubmitButton = styled(Button)`
  height: 100%;
  padding: 0.25rem 1rem;
`;

const AddCapabilityButton = styled(AddItemButton)`
  height: 1.75rem;
  border-radius: 0.875rem;
  font-weight: 700;
`;