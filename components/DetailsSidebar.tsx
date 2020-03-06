import styled from 'styled-components';
import { useTypedSelector, MOVE, closeDetailsPanel, ABILITY, CAPABILITY, HELD_ITEM, saveNotes } from '../store/store';
import { Theme } from '../utils/theme';
import { StatList, StatRow, StatKey, StatValue, StatRowDivider, IconButton, TypeList } from './Layout';
import { getAttackType } from './moves';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { RichTextEditor } from './RichTextEditor';
import { getOffensiveEffectivenesses, TypeName } from '../utils/pokemonTypes';
import { TypeIndicator } from './TypeIndicator';

export const DetailsSidebar = () => {
  const activeDetails = useTypedSelector(state => state.activeDetails);
  const pokemon = useTypedSelector(state => state.pokemon);
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(closeDetailsPanel());
  }, [dispatch]);

  const handleSaveNotes = useCallback(notes => {
    dispatch(saveNotes(pokemon.id, notes));
  }, [dispatch, pokemon.id]);

  const typeEffectiveness = activeDetails.details?.type === MOVE && getOffensiveEffectivenesses(activeDetails.details?.value.type.name.toLowerCase() as TypeName);

  return(
    <Container className={activeDetails.mode == 'none' ? '' : 'active'}>
      <BackgroundStripe />
      <Title>
        {activeDetails.mode === 'description' && (activeDetails.details?.value.name ?? <span>&nbsp;</span>)}
        {activeDetails.mode === 'notes' && 'Notes'}
        <IconButton icon={faTimes} onClick={handleClose} inverse />
      </Title>

      <StatList>
        {activeDetails.details?.type === MOVE && (
          <>
            <StatRow>
              <StatKey>Accuracy</StatKey>
              <StatValue>{activeDetails.details.value.ac}</StatValue>
            </StatRow>
            <StatRow>
              <StatKey>Range</StatKey>
              <StatValue>{activeDetails.details.value.attack_range}</StatValue>
            </StatRow>
            <StatRow>
              <StatKey>Attack Type</StatKey>
              <StatValue>{getAttackType(activeDetails.details.value.attack_type)}</StatValue>
            </StatRow>
            {activeDetails.details.value.damage !== '-' && (
              <StatRow>
                <StatKey>Damage</StatKey>
                <StatValue>{activeDetails.details.value.damage}</StatValue>
              </StatRow>
            )}
            <StatRowDivider />
            <StatRow>
              <Description dangerouslySetInnerHTML={{ __html: activeDetails.details.value.effects}} />
            </StatRow>
            {activeDetails.details.value.attack_type !== 2 && (
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
        {activeDetails.details?.type === ABILITY && (
          <>
            <StatRow>
              <StatKey>Frequency</StatKey>
              <StatValue>{activeDetails.details.value.frequency}</StatValue>
            </StatRow>
            <StatRowDivider />
            <StatRow>
              <Description dangerouslySetInnerHTML={{ __html: activeDetails.details.value.description}} />
            </StatRow>
          </>
        )}
        {(activeDetails.details?.type === CAPABILITY || activeDetails.details?.type === HELD_ITEM) && (
          <>
            <StatRow>
              <Description dangerouslySetInnerHTML={{ __html: activeDetails.details.value.description}} />
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
  }
  

  &.active {
    right: 0;
  }

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    width: 100vw;
    
    &:not(.active) {
      right: -100vw;
    }

    & ${StatList} {
      width: calc(100% - 2rem);
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

export const BackgroundStripe = styled.div`
  position: absolute;
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
    clip-path: unset;
    width: 100vw;
    
    &::before {
      display: none;
    }
  }
`;

const MoveTypeList = styled(TypeList)`
  @media screen and (min-width: 1440px) {
    grid-template-columns: repeat(2, max-content);
  }
`;