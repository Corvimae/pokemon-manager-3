import styled from 'styled-components';
import Handlebars from 'handlebars';
import { MOVE, closeDetailsPanel, ABILITY, CAPABILITY, HELD_ITEM, saveNotes, SKILL, EDGE, ActiveDetail } from '../store/pokemon';
import { Theme } from '../utils/theme';
import { StatList, StatRow, StatKey, StatValue, StatRowDivider, IconButton, TypeList } from './Layout';
import { getAttackType, getDiceRoll } from '../utils/moves';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { RichTextEditor } from './RichTextEditor';
import { getOffensiveEffectivenesses, TypeName } from '../utils/pokemonTypes';
import { TypeIndicator } from './TypeIndicator';
import { useTypedSelector } from '../store/rootReducer';
import { Pokemon } from '../server/models/pokemon';


Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

function getRelevantJunctionData(activeDetail: ActiveDetail, pokemon: Pokemon): object {
  switch (activeDetail.type) {
    case 'MOVE':
      return pokemon.moves.find(move => move.id === activeDetail.value.id)?.PokemonMove ?? {};

    case 'CAPABILITY':
      return pokemon.capabilities.find(capability => capability.id === activeDetail.value.id)?.PokemonCapability ?? {};

    case 'SKILL':
      return pokemon.skills.find(skill => skill.id === activeDetail.value.id)?.PokemonSkill ?? {};

    case 'EDGE':
      return pokemon.edges.find(edge => edge.id === activeDetail.value.id)?.PokemonEdge ?? {};

    default:
      return {};
  }
}

export const DetailsSidebar = () => {
  const activeDetails = useTypedSelector(state => state.pokemon.activeDetails);
  const pokemon = useTypedSelector(state => state.pokemon.data);
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(closeDetailsPanel());
  }, [dispatch]);

  const handleSaveNotes = useCallback(notes => {
    dispatch(saveNotes(pokemon.id, notes));
  }, [dispatch, pokemon.id]);

  const effectText = useMemo(() => {
    if (!activeDetails.details?.value) return '-';

    const template = Handlebars.compile(activeDetails.details.value.effect);

    return template(getRelevantJunctionData(activeDetails.details, pokemon));
  }, [activeDetails, pokemon]);

  const typeEffectiveness = activeDetails.details?.type === MOVE && getOffensiveEffectivenesses(activeDetails.details?.value?.type as TypeName);

  return(
    <Container className={activeDetails.mode == 'none' ? '' : 'active'}>
      <BackgroundStripe />
      <Title>
        {activeDetails.mode !== 'notes' && (activeDetails.details?.value?.name ?? <span>&nbsp;</span>)}
        {activeDetails.mode === 'notes' && 'Notes'}
        <IconButton icon={faTimes} onClick={handleClose} inverse />
      </Title>

      <StatList>
        {activeDetails.details?.type === MOVE && activeDetails.details?.value && (
          <>
            {activeDetails.details.value.ac !== null && (
              <StatRow>
                <StatKey>Accuracy</StatKey>
                <StatValue>{activeDetails.details.value.ac}</StatValue>
              </StatRow>
            )}
            <StatRow>
              <StatKey>Range</StatKey>
              <StatValue>{activeDetails.details.value.range}</StatValue>
            </StatRow>
            <StatRow>
              <StatKey>Attack Type</StatKey>
              <StatValue>{getAttackType(activeDetails.details.value.damageType)}</StatValue>
            </StatRow>
            {activeDetails.details.value.damageBase !== null && (
              <StatRow>
                <StatKey>Damage</StatKey>
                <StatValue>
                  {activeDetails.details.value.damageBase} ({getDiceRoll(activeDetails.details.value.damageBase)})
                </StatValue>
              </StatRow>
            )}
            {activeDetails.details.value.effect !== '-' && <StatRowDivider />}
            {activeDetails.details.value.damageType !== 'status' && (
              <>
                <StatRowDivider />
                <StatRow>
                  <StatKey>Super effective against</StatKey>
                  <MoveTypeList>
                    {typeEffectiveness.x2.map(strength => (
                      <TypeIndicator key={strength} name={strength} icon/>
                    ))}
                  </MoveTypeList>
                </StatRow>
                <StatRow>
                  <StatKey>Not very effective against</StatKey>
                  <MoveTypeList>
                    {typeEffectiveness.half.map(weakness => (
                      <TypeIndicator key={weakness} name={weakness} icon />
                    ))}
                  </MoveTypeList>
                </StatRow>
                <StatRow>
                  <StatKey>Fails against</StatKey>
                  <MoveTypeList>
                    {typeEffectiveness.x0.map(immunity => (
                      <TypeIndicator key={immunity} name={immunity} icon />
                    ))}
                  </MoveTypeList>
                </StatRow>
              </>
            )}
          </>
        )}
        {activeDetails.details?.type === ABILITY && activeDetails.details?.value && (
          <>
            {activeDetails.details.value.frequency && (
              <StatRow>
                <StatKey>Frequency</StatKey>
                <StatValue>{activeDetails.details.value.frequency}</StatValue>
              </StatRow>
            )}
            {activeDetails.details.value.trigger && (
              <StatRow>
                <StatKey>Trigger</StatKey>
                <StatValue>{activeDetails.details.value.trigger}</StatValue>
              </StatRow>
            )}
            {activeDetails.details.value.target && (
              <StatRow>
                <StatKey>Target</StatKey>
                <StatValue>{activeDetails.details.value.target}</StatValue>
              </StatRow>
            )}
          </>
        )}
        {activeDetails.details?.type === EDGE && activeDetails.details?.value && (
          <>
            <StatRow>
              <StatKey>Cost</StatKey>
              <StatValue>
                {activeDetails.details.value.cost}&nbsp;Tutor&nbsp;Point{activeDetails.details.value.cost !== 1 && 's'}
              </StatValue>
            </StatRow>
            <StatRowDivider />
          </>
        )}
        {(activeDetails.details?.value?.effect ?? '-') !== '-' && (
          <>
            <StatRow>
              <Description dangerouslySetInnerHTML={{ __html: effectText}} />
            </StatRow>
          </>
        )}
      </StatList>
      
      {activeDetails.mode === 'notes' && (
        <NotesEditorContainer>
          <RichTextEditor defaultValue={pokemon.notes} onSave={handleSaveNotes} />
        </NotesEditorContainer>
      )}
    </Container>
  );
};

export const BackgroundStripe = styled.div`
  position: absolute;
  display: none;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: ${Theme.backgroundStripe};
  clip-path: polygon(8rem 0, 100% 0%, 100% 100%, 0 100%);
  z-index: -1;
  pointer-events: none;
  overflow: visible;
  
  &::before {
    content: '';
    position: absolute;
    left: 4rem;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.25);
    clip-path: polygon(8rem 0, 100% 0%, 100% 100%, 0 100%);
    z-index: -2;
  }

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    position: fixed;
    clip-path: unset;
    width: 100vw;
    
    &::before {
      display: none;
    }
  }
`;

const Container = styled.div`
  position: fixed;
  display: flex;
  right: -30rem;
  top: 0;
  width: 28rem;
  height: 100vh;
  flex-direction: column;
  align-items: flex-end;
  padding: 1rem 0;
  transition: right 100ms ease-in;
  z-index: 10;

  & ${StatList} {
    width: 28rem;
    grid-template-columns: max-content 1fr;
    max-height: calc(100vh - 6.5rem);
    overflow: auto;
  }
  

  &.active {
    right: 0;

    & ${BackgroundStripe} {
      display: block;
    }
  }

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    width: 100vw;
    overflow-y: auto;
    
    &:not(.active) {
      right: -100vw;
    }

    & ${StatList} {
      width: 100%;
      grid-template-columns: 1fr min-content;
    }

    & ${StatKey} {
      text-align: center;
    }
  }
`;

const Title = styled.div`
  display: flex;
  width: 30rem;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700; 
  padding: 0.25rem 1rem;
  background-color: #333;
  margin-bottom: 1rem;

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    width: 100vw;
  }

`;

const Description = styled(StatValue)`
  display: initial;
  grid-column: 1 / -1;
  text-align: left;
  line-height: 1.52;
  font-size: 1rem;
`;

const NotesEditorContainer = styled(StatValue)`
  position: relative;
  height: calc(100vw - 10rem);
  width: 26rem;
  padding: 0;
  box-shadow: ${Theme.dropShadow};

  & > div {
    width: 100%;
  }

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    width: 100%;
    height: calc(100% - 2rem);
  }
`;

const MoveTypeList = styled(TypeList)`
  @media screen and (min-width: 1440px) {
    grid-template-columns: repeat(2, max-content);
  }
`;