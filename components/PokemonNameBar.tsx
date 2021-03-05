import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faMinus, faVenus, faStar, faLock, faMars, faBook } from '@fortawesome/free-solid-svg-icons';
import { faStar as faHollowStar } from '@fortawesome/free-regular-svg-icons';
import { toggleEditMode, setPokemonActive, setPokemonName, setPokemonGender, showNotes } from '../store/pokemon';
import { calculateLevel } from '../utils/level';
import { Gender } from '../utils/types';
import { IconButton, Tooltip, TextInput } from './Layout';
import { DropdownTooltip } from './DropdownTooltip';
import { Theme } from '../utils/theme';
import { useTypedSelector } from '../store/rootReducer';

const GENDER_OPTIONS: Gender[] = ['male', 'female', 'neutral'];

export function getGenderColor(gender: Gender) {
  switch (gender) {
    case 'male':
      return '#00f';
    case 'female':
      return '#f00';
    case 'neutral':
      return '#999';
  }
}

export function getGenderIcon(gender: Gender) {
  switch (gender) {
    case 'male':
      return faMars;
    case 'female':
      return faVenus;
    case 'neutral':
      return faMinus;
  }
}

export const PokemonNameBar = () => {
  const dispatch = useDispatch();
  const isUserOwner = useTypedSelector(store => store.pokemon.isUserOwner);
  const editMode = useTypedSelector(store => store.pokemon.editMode);
  const pokemonId = useTypedSelector(store => store.pokemon.data.id);
  const name = useTypedSelector(store => store.pokemon.data.name);
  const gender = useTypedSelector(store => store.pokemon.data.gender);
  const experience = useTypedSelector(store => store.pokemon.data.experience);
  const active = useTypedSelector(store => store.pokemon.data.active);
  const speciesName = useTypedSelector(store => store.pokemon.data.species.name);

  const [showGenderSelector, setShowGenderSelector] = useState(false);

  const handleToggleEditMode = useCallback(() => {
    dispatch(toggleEditMode());
  }, [dispatch]);

  const handleShowNotes = useCallback(() => {
    dispatch(showNotes());
  }, [dispatch]);

  const handleSetActive = useCallback(() => {
    if(editMode) {
      dispatch(setPokemonActive(pokemonId, !active));
    }
  }, [editMode, dispatch, pokemonId, active]);

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPokemonName(pokemonId, event.target.value));
  }, [dispatch]);

  const handleGenderChange = useCallback(value => {
    dispatch(setPokemonGender(pokemonId, value));
    setShowGenderSelector(false);
  }, [dispatch]);

  const handleToggleGenderSelector = useCallback(event => {
    if (editMode) {
      event.stopPropagation();
      setShowGenderSelector(!showGenderSelector);
    }
  }, [editMode, showGenderSelector]);

  return (
    <NameBar>
      <BallIcon />
      <NameAndLevel>
        <PokemonName>
          <span>
            {!editMode && name}
            {editMode && <NameInput defaultValue={name} onChange={handleNameChange} />}
          </span>
          <Tooltip content="This Pokémon is on its trainer's active roster." enabled={!editMode && active}>
            <ActiveIconContainer role={editMode ? 'button' : undefined} tabIndex={editMode ? 0 : -1} onClick={handleSetActive}>
              {active && <ActiveIcon icon={faStar} size="xs" />}
              {!active && editMode && <ActiveIcon icon={faHollowStar} size="xs" />}
            </ActiveIconContainer>
          </Tooltip>
        </PokemonName>
        <PokemonLevel>
          Lv. {calculateLevel(experience)} {speciesName}
        </PokemonLevel>
      </NameAndLevel>
      <GenderSelector role={editMode ? "button" : undefined} tabIndex={editMode ? 0 : undefined} onClick={handleToggleGenderSelector}>
        <GenderIcon color={getGenderColor(gender)}>
          <FontAwesomeIcon icon={getGenderIcon(gender)} size="sm"/>
        </GenderIcon>
        <DropdownTooltip visible={showGenderSelector} onVisibilityChange={setShowGenderSelector}>
          <GenderSelectorGrid>
            {GENDER_OPTIONS.map(option => (
              <GenderDropdownOption key={option} onClick={() => handleGenderChange(option)}>
                <GenderIcon color={getGenderColor(option)}>
                  <FontAwesomeIcon icon={getGenderIcon(option)} size="sm"/>
                </GenderIcon>
              </GenderDropdownOption>
            ))}
          </GenderSelectorGrid>
        </DropdownTooltip>
      </GenderSelector>
      <ActionButtons>
        {!editMode && <NotesButton icon={faBook} onClick={handleShowNotes} inverse>Notes</NotesButton>}
        {isUserOwner && (
          <EditButton icon={editMode ? faLock : faPencilAlt} onClick={handleToggleEditMode} inverse>
            {editMode ? 'Lock' : 'Edit'}
          </EditButton>
        )}
      </ActionButtons>
    </NameBar>
  );
};

const PokemonName = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 700;
`;

const PokemonLevel = styled.span`
  font-size: 1rem;
  margin-left: auto;
  padding: 0 1rem 0 4rem;
`;


const NameAndLevel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  line-height: 1;
`;


const BallIcon = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  background-image: url(https://play.pokemonshowdown.com/sprites/itemicons/poke-ball.png);
  background-size: cover;
  margin-right: 0.5rem;
`;

const GenderSelector = styled.div`
  position: relative;
  display: flex;
  top: -0rem;
  height: calc(100% + 0.5rem);
  padding: 0.25rem 0.75rem;
  justify-content: center;
  align-items: center;
  appearance: none;
  border: none;
  background-color: transparent;
  margin-right: 1.25rem;

  &:active,
  &:focus,
  &:hover {
    background-color: ${props => props.role === 'button' && 'rgba(255, 255, 255, 0.25)'};
    outline: none;
  }
`;

const GenderIcon = styled.div<{ color: string }>`
  display: flex;
  width: 1.25rem;
  height: 1.25rem;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: #fff;
  background-color: ${props => props.color};

  & > svg {
    font-size: 0.875rem;
  }
`;

const GenderSelectorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, max-content);
  grid-gap: 0.5rem;
`;

const GenderDropdownOption = styled.button`
  display: flex;
  padding: 0.25rem;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  appearance: none;
  border: none;
  background-color: transparent;

  &:active,
  &:focus,
  &:hover {
    background-color: rgba(0, 0, 0, 0.25);
    outline: none;
  }
`;

const ActiveIcon = styled(FontAwesomeIcon)`
  color: #fff;
  height: 0.75rem;
`;

const ActiveIconContainer = styled.div`
  display: flex;
  margin-left: 0.75rem;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const NameInput = styled(TextInput)`
  width: 16rem;
  height: 1.5rem;
  color: #fff;
  font-weight: 700;
  font-size: 1.25rem;
  padding: 0 0.25rem;
  line-height: normal;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: auto;
`;

const EditButton = styled(IconButton)``;
const NotesButton = styled(IconButton)`
  margin: 0 0.75rem 0 0;
`;

const NameBar = styled.div`
  position: relative;
  display: flex;
  min-width: calc(100% + 8rem);
  flex-direction: row;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 0.25rem 1rem 0.25rem 1rem;
  line-height: normal;

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    width: 100vw;
    min-width: 100vw;
    flex-shrink: 0;

    & ${BallIcon} {
      align-self: flex-start;
      margin-top: 0.325rem;
    }

    & ${NameAndLevel} {
      flex-direction: column;
      align-items: flex-start;
    }

    & ${PokemonName} {
      line-height: 1.25;
    }

    & ${PokemonLevel} {
      padding: 0;
      font-size: 0.875rem;
      margin-left: 0;
    }

    & ${GenderSelector} {
      margin-left: 0.5rem;
    }

    & ${NotesButton} {
      margin-right: 1rem;
    }
    
    & ${NameInput} {
      width: 7rem;
    }
  }
`;
