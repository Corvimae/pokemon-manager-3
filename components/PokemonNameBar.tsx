import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faMinus, faVenus, faStar, faLock, faMars } from '@fortawesome/free-solid-svg-icons';
import { faStar as faHollowStar } from '@fortawesome/free-regular-svg-icons';
import { useTypedSelector, toggleEditMode, setPokemonActive, setPokemonName, setPokemonGender } from '../store/store';
import { calculateLevel } from '../utils/level';
import { Gender } from '../utils/types';
import { IconButton, Tooltip, TextInput } from './Layout';
import { DropdownTooltip } from './DropdownTooltip';

const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'None'];

function getGenderColor(gender: Gender) {
  switch (gender) {
    case 'Male':
      return '#00f';
    case 'Female':
      return '#f00';
    case 'None':
      return '#999';
  }
}

function getGenderIcon(gender: Gender) {
  switch (gender) {
    case 'Male':
      return faMars;
    case 'Female':
      return faVenus;
    case 'None':
      return faMinus;
  }
}

export const PokemonNameBar = () => {
  const dispatch = useDispatch();
  const editMode = useTypedSelector(store => store.editMode);
  const pokemonId = useTypedSelector(store => store.pokemon.id);
  const name = useTypedSelector(store => store.pokemon.name);
  const gender = useTypedSelector(store => store.pokemon.gender);
  const experience = useTypedSelector(store => store.pokemon.experience);
  const active = useTypedSelector(store => store.pokemon.isActive);
  const speciesName = useTypedSelector(store => store.pokemon.species.name);

  const [showGenderSelector, setShowGenderSelector] = useState(false);

  const handleToggleEditMode = useCallback(() => {
    dispatch(toggleEditMode());
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
      <GenderSelector role={editMode ? "button" : undefined} tabIndex={editMode ? 0 : -1} onClick={handleToggleGenderSelector}>
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
      <IconButton icon={editMode ? faLock : faPencilAlt} onClick={handleToggleEditMode} inverse>
        {editMode ? 'Lock' : 'Edit'}
      </IconButton>
    </NameBar>
  );
};

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
`;


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
    background-color: rgba(255, 255, 255, 0.25);
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