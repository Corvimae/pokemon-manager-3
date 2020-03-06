import { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { calculateExperienceToNextLevel, calculatePercentageToNextLevel, calculateLevel } from '../utils/level';
import { useTypedSelector, HELD_ITEM, setNature, setHeldItem, setPokemonType, setPokemonSpecies, setPokemonExperience, setPokemonLoyalty, setPokemonOwner, saveGMNotes } from '../store/store';
import { TypeIndicator } from './TypeIndicator';
import { StatValue, StatKey, StatRow, StatList, StatRowDivider, TextInput, NumericInput, TypeList } from './Layout';
import { useRequestData } from '../utils/requests';
import { useSpecialEvasions, useSpeedEvasions, usePhysicalEvasions } from '../utils/formula';
import { SelectablePokemonValue } from './SelectablePokemonValue';
import { AbilityList } from './AbilityList';
import { TypeSelector } from './TypeSelector';
import { RichTextEditor } from './RichTextEditor';
import { Theme } from '../utils/theme';
import { useCombinedDefensiveEffectivenesses } from '../utils/pokemonTypes';

export const PokemonDataTable = () => {
  const dispatch = useDispatch();
  const mobileMode = useTypedSelector(store => store.mobileMode);
  const editMode = useTypedSelector(store => store.editMode);
  const pokemon = useTypedSelector(store => store.pokemon);

  
  const showGMEditor = editMode && pokemon.isUserGM;
  
  const physicalEvasions = usePhysicalEvasions();
  const specialEvasions = useSpecialEvasions();
  const speedEvasions = useSpeedEvasions();
  const defenses = useCombinedDefensiveEffectivenesses();

  const requestHeldItemData = useRequestData(HELD_ITEM);

  const handleChangeType = useCallback((index, id, name) => {
    dispatch(setPokemonType(pokemon.id, index, id, name));
  }, [dispatch, pokemon.id]);

  const handleChangeNature = useCallback(({ value, label }) => {
    dispatch(setNature(pokemon.id, value, label));
  }, [dispatch, pokemon.id])
  
  const handleChangeHeldItem = useCallback(({ value, label }) => {
    dispatch(setHeldItem(pokemon.id, value, label));
  }, [dispatch, pokemon.id]);

  const handleChangeSpecies = useCallback(({ value }) => {
    dispatch(setPokemonSpecies(pokemon.id, value));
  }, [dispatch, pokemon.id]);

  const handleChangeExperience = useCallback(event => {
    dispatch(setPokemonExperience(pokemon.id, event.target.value));
  }, [dispatch, pokemon.id]);

  const handleChangeLoyalty = useCallback(event => {
    dispatch(setPokemonLoyalty(pokemon.id, event.target.value));
  }, [dispatch, pokemon.id]);

  const handleChangeOwner = useCallback(({ value, label }) => {
    dispatch(setPokemonOwner(pokemon.id, value, label));
  }, [dispatch, pokemon.id]);

  const handleSaveGMNotes = useCallback(notes => {
    dispatch(saveGMNotes(pokemon.id, notes));
  }, [dispatch, pokemon.id]);

  return (
    <StatTable isActiveMobileMode={mobileMode === 'data'}>
      <StatRow>
        <StatKey>Trainer</StatKey>
        <SelectablePokemonValue
          id={pokemon.owner.id}
          value={pokemon.owner.name}
          path={`trainers/${pokemon.campaign.id}`}
          onChange={handleChangeOwner}
          requireGMToEdit
        />
      </StatRow>
      <StatRow>
        <StatKey>Species</StatKey>
        <SelectablePokemonValue
          id={pokemon.species.id}
          value={pokemon.species.name}
          path='species'
          onChange={handleChangeSpecies}
        />
      </StatRow>
      <StatRow>
        <StatKey>Type</StatKey>
        <TypeIcons>
          {pokemon.types.map((type, index) => (
            <TypeSelector key={index} value={type.name} onSelect={(id, name) => handleChangeType(index, id, name)} />
          ))}
        </TypeIcons>
      </StatRow>
      <StatRowDivider />
      <StatRow>
        <StatKey>Experience Points</StatKey>
        <StatValue>
          {!editMode && pokemon.experience}
          {editMode && (
            <RowValueNumericInput type="number" onChange={handleChangeExperience} defaultValue={pokemon.experience} />
          )}
        </StatValue>
      </StatRow>
      <StatRow>
        <StatKey>Exp. to next level</StatKey>
        <PointsToLevelContainer>
          <PointsToLevel>{calculateExperienceToNextLevel(pokemon.experience)}</PointsToLevel>
          <PointsToLevelBar percentage={calculatePercentageToNextLevel(pokemon.experience)} />
        </PointsToLevelContainer>
      </StatRow>
      {pokemon.loyalty !== null && (
        <StatRow>
          <StatKey>Loyalty</StatKey>
          <StatValue>
            {!showGMEditor && pokemon.loyalty}
            {showGMEditor && (
              <RowValueNumericInput type="number" onChange={handleChangeLoyalty} defaultValue={pokemon.loyalty} />
            )}
          </StatValue>
        </StatRow>
      )}
      <StatRowDivider />
      <StatRow>
        <StatKey>Nature</StatKey>
        <SelectablePokemonValue
          id={pokemon.nature.id}
          value={pokemon.nature.name}
          path='natures'
          onChange={handleChangeNature}
        />
      </StatRow>
      <StatRow>
        <StatKey>Abilities</StatKey>
        <AbilityList />
      </StatRow>
      <StatRow>
        <StatKey>Held Item</StatKey>
        <SelectablePokemonValue
          id={pokemon.heldItem.id}
          value={pokemon.heldItem.name}
          path='heldItems'
          onChange={handleChangeHeldItem}
          onClick={() => requestHeldItemData(pokemon.heldItem.id)}
        />
      </StatRow>
      <StatRowDivider />
      <StatRow>
        <StatKey>Physical Evasion</StatKey>
        <StatValue>{physicalEvasions}</StatValue>
      </StatRow>
      <StatRow>
        <StatKey>Special Evasion</StatKey>
        <StatValue>{specialEvasions}</StatValue>
      </StatRow>
      <StatRow>
        <StatKey>Speed Evasion</StatKey>
        <StatValue>{speedEvasions}</StatValue>
      </StatRow>
      <StatRowDivider />
      <StatRow>
        <StatKey>STAB Modifier</StatKey>
        <StatValue>
          {Math.floor(calculateLevel(pokemon.experience) / 5)}
        </StatValue>
      </StatRow>
      <StatRowDivider />
      <StatRow>
        <StatKey>Weaknesses</StatKey>
        <TypeList>
          {defenses.x4.map(weakness => (
            <TypeIndicator key={weakness} name={weakness} multiplier={4} />
          ))}
          {defenses.x2.map(weakness => (
            <TypeIndicator key={weakness} name={weakness} multiplier={2} />
          ))}
        </TypeList>
      </StatRow>				
      <StatRow>
        <StatKey>Resistances</StatKey>
        <TypeList>
          {defenses.fourth.map(resistance => (
            <TypeIndicator key={resistance} name={resistance} multiplier={0.25} />
          ))}
          {defenses.half.map(resistance => (
            <TypeIndicator key={resistance} name={resistance} multiplier={0.5} />
          ))}
        </TypeList>
      </StatRow>
      <StatRow>
        <StatKey>Immunities</StatKey>
        <TypeList>
          {defenses.x0.map(resistance => (
            <TypeIndicator key={resistance} name={resistance} multiplier={0} />
          ))}
        </TypeList>
      </StatRow>
      <StatRowDivider />
      {!showGMEditor && (
        <PokemonImage>
          <img src={`https://play.pokemonshowdown.com/sprites/ani/${pokemon.species.name.toLowerCase()}.gif`} />
        </PokemonImage>
      )}
      {showGMEditor && (
        <>
          <StatRow>
            <StatKey>GM Notes</StatKey>
            <GMNotesEditorContainer>
              <RichTextEditor defaultValue={pokemon.gmNotes} onSave={handleSaveGMNotes} />
            </GMNotesEditorContainer>
          </StatRow>
        </>
      )}
    </StatTable>
  );
};

const StatTable = styled(StatList)<{ isActiveMobileMode: boolean }>`
  @media screen and (max-width: ${Theme.mobileThreshold}) {
    display: ${({ isActiveMobileMode }) => !isActiveMobileMode && 'none'};
    min-width: 100vw;
    grid-template-columns: max-content 1fr;
  }
`;

const PointsToLevelContainer = styled(StatValue)`
  flex-direction: column;
`;

const PointsToLevel = styled.div`
  text-align: right;
`;

const PointsToLevelBar = styled.div<{ percentage: number }>`
  position: relative;
  height: 0.25rem;
  width: 100%;
  background-color: #606060;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: ${props => props.percentage}%;
    height: 100%;
    background-color: #13a8b0;
  }
`;

const TypeIcons = styled(StatValue)`
  & > ${TypeIndicator}:first-child {
    margin-right: 0.25rem;
  }
`;

const RowValueNumericInput = styled(TextInput)`
  width: 100%;
  border-bottom: 1px solid #333;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const PokemonImage = styled.div`
  display: flex;
  height: 10rem;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  grid-column: 1 / -1;
  background-image: url(https://em-uploads.s3.amazonaws.com/profilebg/312687.png);
  background-size: cover;
  border: 0.25rem solid rgba(0, 0, 0, 0.75);

  & > img {
    margin-bottom: 1.5rem;
  }
`;

const GMNotesEditorContainer = styled(StatValue)`
  position: relative;
  height: 10rem;
  width: 30rem;
  padding: 0;

  & > div {
    width: 100%;
  }

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    width: auto;
  }
`;