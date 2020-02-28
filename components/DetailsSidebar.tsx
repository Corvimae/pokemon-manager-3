import styled from 'styled-components';
import { useTypedSelector, MOVE, closeDetailsPanel, ABILITY, CAPABILITY, HELD_ITEM } from '../store/store';
import { Theme } from '../utils/theme';
import { StatList, StatRow, StatKey, StatValue, StatRowDivider, IconButton } from './Layout';
import { getAttackType } from './moves';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const DetailsSidebar = () => {
  const activeDetails = useTypedSelector(state => state.activeDetails);
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(closeDetailsPanel());
  }, [dispatch]);

  return(
    <Container className={activeDetails.isVisible ? 'active' : ''}>
      <BackgroundStripe />
      <Title>
        {activeDetails.details?.value.name ?? <span>&nbsp;</span>}
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
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  display: flex;
  right: -26rem;
  top: 0;
  width: 24rem;
  height: 100vh;
  flex-direction: column;
  align-items: flex-end;
  padding: 1rem 0;
  transition: right 100ms ease-in;
  z-index: 10;
  & ${StatList} {
    width: 24rem;
    grid-template-columns: max-content 1fr;
  }

  &.active {
    right: 0;
  }
`;

const BackgroundStripe = styled.div`
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
`;

const Title = styled.div`
  display: flex;
  width: 26rem;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700; 
  padding: 0.25rem 1rem;
  background-color: #333;
  margin-bottom: 1rem;
`;

const Description = styled(StatValue)`
  display: initial;
  grid-column: 1 / -1;
  text-align: left;
  line-height: 1.52;
  font-size: 1rem;
`;