import styled from 'styled-components';
import { calculateExperienceToNextLevel, calculatePercentageToNextLevel, calculateLevel } from '../utils/level';
import { useTypedSelector, HELD_ITEM, setNature, setHeldItem, setPokemonType, setPokemonSpecies, setPokemonExperience } from '../store/store';
import { TypeIndicator } from './TypeIndicator';
import { StatValue, StatKey, StatRow, StatList, StatRowDivider, TextInput, NumericInput } from './Layout';
import { useRequestData } from '../utils/requests';
import { useSpecialEvasions, useSpeedEvasions, usePhysicalEvasions } from '../utils/formula';
import { SelectablePokemonValue } from './SelectablePokemonValue';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { CapabilityList } from './CapabilityList';
import { AbilityList } from './AbilityList';
import { TypeSelector } from './TypeSelector';

export const PokemonDataTable = () => {
  const dispatch = useDispatch();
  const editMode = useTypedSelector(store => store.editMode);
  const pokemon = useTypedSelector(store => store.pokemon);

  const physicalEvasions = usePhysicalEvasions();
  const specialEvasions = useSpecialEvasions();
  const speedEvasions = useSpeedEvasions();

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

  return (
    <StatList>
      <StatRow>
        <StatKey>Trainer</StatKey>
        <StatValue>{pokemon.owner.name}</StatValue>
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
            <TypeSelector key={type.id} value={type.name} onSelect={(id, name) => handleChangeType(index, id, name)} />
          ))}
        </TypeIcons>
      </StatRow>
      <StatRowDivider />
      <StatRow>
        <StatKey>Experience Points</StatKey>
        <StatValue>
          {!editMode && pokemon.experience}
          {editMode && (
            <ExperienceInput type="number" onChange={handleChangeExperience} defaultValue={pokemon.experience} />
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
          {Object.entries(pokemon.defenses.SE).map(([weakness, multiplier]) => (
            <TypeIndicator key={weakness} name={weakness} multiplier={multiplier} />
          ))}
        </TypeList>
      </StatRow>				
      <StatRow>
        <StatKey>Resistances</StatKey>
        <TypeList>
          {Object.entries(pokemon.defenses.NVE).map(([resistance, multiplier]) => (
            <TypeIndicator key={resistance} name={resistance} multiplier={multiplier} />
          ))}
        </TypeList>
      </StatRow>
      <StatRow>
        <StatKey>Immunities</StatKey>
        <TypeList>
          {Object.entries(pokemon.defenses.Immune).map(([resistance, multiplier]) => (
            <TypeIndicator key={resistance} name={resistance} multiplier={multiplier} />
          ))}
        </TypeList>
      </StatRow>
      <StatRowDivider />
      <PokemonImage>
        <img src={`https://play.pokemonshowdown.com/sprites/ani/${pokemon.species.name.toLowerCase()}.gif`} />
      </PokemonImage>
    </StatList>
  );
};

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

const TypeList = styled(StatValue)`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-gap: 0.25rem;

  @media screen and (min-width: 1440px) {
    grid-template-columns: repeat(3, max-content);
  }
`;

const TypeIcons = styled(StatValue)`
  & > ${TypeIndicator}:first-child {
    margin-right: 0.25rem;
  }
`;

const ExperienceInput = styled(TextInput)`
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
