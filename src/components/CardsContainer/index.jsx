import './CardsContainer.scss';
import Card from './Card';

function CardsContainer() {
  return (
    <div className='cardsContainer__container'>
      <Card title="About me" className='cardsContainer__about'/>
      <Card title="Experiences" className='cardsContainer__experience'/>
      <Card title="Stack" isSelected className='cardsContainer__stack'/>
      <Card title="Contact" className='cardsContainer__contact'/>
    </div>
  );
}

export default CardsContainer;
