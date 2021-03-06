import { useCallback } from "react";
import styled from 'styled-components';
import { SKILL, updateSkillLevel, updateSkillBonus, removeSkill } from "../store/pokemon";
import { useRequestData } from "../utils/requests";
import { Theme } from "../utils/theme";
import { useDispatch } from "react-redux";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "./Layout";
import { SortableElement } from "react-sortable-hoc";
import { useTypedSelector } from "../store/rootReducer";
import { JunctionedSkill } from "../server/models/pokemon";

interface SkillIndicatorProps {
  skill: JunctionedSkill;
}

export const UnsortableSkillIndicator: React.FC<SkillIndicatorProps> = ({ skill }) => {
  const dispatch = useDispatch();
  const pokemonId = useTypedSelector(store => store.pokemon.data.id);
  const editMode = useTypedSelector(state => state.pokemon.editMode);

  const requestSkillData = useRequestData(SKILL);

  const handleEditLevelChange = useCallback(event => {
    dispatch(updateSkillLevel(pokemonId, skill.id, event.target.value));
  }, [dispatch, pokemonId, skill.id]);

  const handleEditBonusChange = useCallback(event => {
    dispatch(updateSkillBonus(pokemonId, skill.id, event.target.value));
  }, [dispatch, pokemonId, skill.id]);

  const handleDelete = useCallback(() => {
    dispatch(removeSkill(pokemonId, skill.id));
  }, [dispatch, removeSkill, skill.id]);

  return (
    <Container
      key={skill.id}
      role="button"
      tabIndex={0}
      onClick={() => !editMode && requestSkillData(skill.id)}
    >
      {editMode && <DeleteButton icon={faTimes} onClick={handleDelete} inverse />}
      <SkillIndicatorName>{skill.name}</SkillIndicatorName>
      <SkillIndicatorValue editMode={editMode}>
        <div>
          {editMode && <SkillValueInput type="number" defaultValue={skill.PokemonSkill.level} onChange={handleEditLevelChange} />}
          {!editMode && skill.PokemonSkill.level}
        </div>
        <DiceText editMode={editMode}>d6&nbsp;+&nbsp;</DiceText>
        <div>
          {editMode && <SkillValueInput type="number" defaultValue={skill.PokemonSkill.bonus} onChange={handleEditBonusChange} />}
          {!editMode && skill.PokemonSkill.bonus}
        </div>
      </SkillIndicatorValue>
    </Container>
  );
}

export const SkillIndicator = SortableElement(UnsortableSkillIndicator);

const Container = styled.div<{ hasValue: boolean }>`
  position: relative;
  display: flex;
  height: 1.75rem;
  max-height: 1.75rem;
  font-family: inherit;
  font-size: inherit;
  line-height: 1;
  border: none;
  margin: 0;
  padding: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #333;
  border-radius: 0.875rem;
  padding: 0 4.75rem 0 0;
  box-shadow: ${Theme.dropShadow};
  overflow: hidden;
`;

const SkillIndicatorName = styled.div`
  display: flex;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  flex-grow: 1;
`;

const SkillIndicatorValue = styled.div<{ editMode: boolean }>`
  position: absolute;
  display: grid;
  top: 0;
  right: 0;
  grid-template-columns: ${props => props.editMode ? '1.5rem max-content 1.5rem' : 'repeat(3, max-content)'};
  width: 5.5rem;
  padding-left: 0.5rem;
  height: 100%;
  background-color: ${({ editMode }) => editMode ? Theme.backgroundStripe : '#31b117'};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  clip-path: polygon(15% 0, calc(100% + 1px) 0%, calc(100% + 1px) 100%, 0% 100%);

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    background-color: ${({ editMode }) => editMode ? '#666' : '#dcbb38'};
  }
`;

const SkillValueInput = styled.input`
  width: 1.5rem;
  font-size: 1rem;
  text-align: center;
  padding: 0;
  margin: 0;
  border: none;
  background-color: transparent;
  border-radius: 0;
  font-family: inherit;
  -moz-appearance: textfield;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const DeleteButton = styled(IconButton)`
  margin: 0 0.5rem;
`;

const DiceText = styled.div<{ editMode: boolean }>`
  font-size: ${props => props.editMode && '0.825rem'};
`;