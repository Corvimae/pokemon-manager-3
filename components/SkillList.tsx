import { useState, useCallback } from "react";
import styled from 'styled-components';
import { useDispatch } from "react-redux";
import { SortableContainer } from 'react-sortable-hoc';
import { addSkill } from "../store/pokemon";
import { Button, NumericInput, AddItemButton, DropdownHeader } from "./Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { DefinitionLookahead } from "./DefinitionLookahead";
import { DropdownTooltip } from "./DropdownTooltip";
import { Theme } from "../utils/theme";
import { useTypedSelector } from "../store/rootReducer";
import { SkillIndicator } from "./SkillIndicator";

export const UnsortableSkillList: React.FC = () => {
  const dispatch = useDispatch();
  const pokemonId = useTypedSelector(store => store.pokemon.data.id);
  const skills = useTypedSelector(store => store.pokemon.data.skills);
  const editMode = useTypedSelector(state => state.pokemon.editMode);

  const [showSkillEditor, setShowSkillEditor] = useState(false);
  const [editorSkillSelection, setEditorSkillSelection] = useState(null);
  const [editorSkillLevel, setEditorSkillLevel] = useState(undefined);
  const [editorSkillBonus, setEditorSkillBonus] = useState(undefined);

  const toggleSkillEditor = useCallback((event: Event) => {
    event.stopPropagation();
    setShowSkillEditor(!showSkillEditor);
  }, [showSkillEditor]);

  const handleSubmit = useCallback(() => {
    dispatch(addSkill(
      pokemonId,
      editorSkillSelection.value,
      editorSkillLevel || 0,
      editorSkillBonus || 0,
    ));
    setShowSkillEditor(false);
  }, [dispatch, pokemonId, editorSkillSelection, editorSkillLevel, editorSkillBonus]);
  
  const handleSetEditorSkillLevel = useCallback(event => setEditorSkillLevel(Number(event.target.value)), []);
  const handleSetEditorSkillBonus = useCallback(event => setEditorSkillBonus(Number(event.target.value)), []);

  return (
    <Container>
      {skills.map((skill, index) => (
        <SkillIndicator key={skill.id} index={index} skill={skill} disabled={!editMode} />
      ))}
      {editMode && (
        <AddSkillContainer>
          <AddSkillButton onClick={toggleSkillEditor}>
            <FontAwesomeIcon icon={faPlus} size="sm" />
            &nbsp;Add Skill
          </AddSkillButton>

          {showSkillEditor && (
            <DropdownTooltip visible={showSkillEditor} onVisibilityChange={setShowSkillEditor}>
              <AddSkillDropdownContent>
                <DropdownHeader>Capability</DropdownHeader>
                <DropdownHeader>Level</DropdownHeader>
                <DropdownHeader/>
                <DropdownBonusHeader>Bonus (optional)</DropdownBonusHeader>
                <div>
                  <DefinitionLookahead
                    path='reference/skills'
                    onChange={setEditorSkillSelection}
                  />
                </div>
                <AddSkillLevelContainer>
                  <AddSkillInput onChange={handleSetEditorSkillLevel} />
                </AddSkillLevelContainer>
                <DiceText>d6 + </DiceText>
                <AddSkillBonusContainer>
                  <AddSkillInput onChange={handleSetEditorSkillBonus} />
                </AddSkillBonusContainer>
                <div>
                  <AddSkillSubmitButton onClick={handleSubmit} disabled={editorSkillSelection === null || editorSkillLevel < 1}>
                    Add
                  </AddSkillSubmitButton>
                </div>
              </AddSkillDropdownContent>
            </DropdownTooltip>
          )}
        </AddSkillContainer>
      )}
    </Container>
  );
};

export const SkillList = SortableContainer(UnsortableSkillList);

const Container = styled.div`
  position: relative;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.25rem;
  margin-top: 0.5rem;

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const AddSkillContainer = styled.div`
  position: relative;
  height: 1.75rem;
`;

const AddSkillDropdownContent = styled.div`
  display: grid;
  grid-template-columns: 15rem 4rem max-content 4rem  max-content;

  & > div {
    padding: 0 0.5rem;
  }
`;

const AddSkillInput = styled(NumericInput)`
  width: 100%;
`;

const AddSkillSubmitButton = styled(Button)`
  height: 100%;
  padding: 0.25rem 1rem;
`;

const AddSkillButton = styled(AddItemButton)`
  height: 1.75rem;
  border-radius: 0.875rem;
  font-weight: 700;
`;

const AddSkillLevelContainer = styled.div`
  && {
    padding-right: 0;
  }

  & > input {
    text-align: right;
  }
`;

const AddSkillBonusContainer = styled.div`
  && {
    padding-left: 0;
  }

  & > input {
    text-align: left;
  }
`;

const DiceText = styled.div`
  display: flex;
  font-weight: 700;
  color: #666;
  padding: 0;
  align-items: flex-end;
  line-height: normal;
  && {
    padding-bottom: 0.75rem;
  }
`;

const DropdownBonusHeader = styled(DropdownHeader)`
  grid-column: span 2;
`;