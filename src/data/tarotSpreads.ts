import { SpreadDef } from '../types';

export const TAROT_SPREADS: SpreadDef[] = [
  {
    id: 'single',
    title: 'Single Card Draw',
    cardCount: 1,
    description: 'One card, one clear question. The most underrated reading there is. Forces you to look at the picture and find the heart of the situation.',
    positions: [
      {
        title: 'Core Insight',
        job: 'The Heart of the Matter',
        question: 'What do I most need to be aware of right now?'
      }
    ]
  },
  {
    id: 'past_present_future',
    title: 'Past • Present • Future',
    cardCount: 3,
    description: 'The classic timeline spread: how you got here, where you are right now, and where momentum is heading.',
    positions: [
      {
        title: 'Past',
        job: 'How you got here',
        question: 'What foundation, past event, or root energy shaped this moment?'
      },
      {
        title: 'Present',
        job: 'Where you are now',
        question: 'What is the active energy, challenge, or reality you are currently standing in?'
      },
      {
        title: 'Future',
        job: 'Where it is heading',
        question: 'Where is the current momentum leading if you continue on this path?'
      }
    ]
  },
  {
    id: 'situation_action_outcome',
    title: 'Situation • Action • Outcome',
    cardCount: 3,
    description: 'A powerful problem-solving spread: what is genuinely happening, what you can actively do, and what follows.',
    positions: [
      {
        title: 'Situation',
        job: "What's going on",
        question: 'What is the true underlying reality of the situation beneath surface assumptions?'
      },
      {
        title: 'Action',
        job: 'What you can do',
        question: 'What concrete attitude or step does this moment ask you to take?'
      },
      {
        title: 'Outcome',
        job: 'Where that leads',
        question: 'What resolution or fruit becomes possible through this action?'
      }
    ]
  },
  {
    id: 'mind_body_spirit',
    title: 'Mind • Body • Spirit',
    cardCount: 3,
    description: 'A gentle holistic check-in across your mental clarity, physical ground, and deeper intuitive self.',
    positions: [
      {
        title: 'Mind',
        job: 'Your thoughts & perceptions',
        question: 'What story is your mind telling, and where is your mental focus?'
      },
      {
        title: 'Body',
        job: 'Your physical & material world',
        question: 'What does your physical body, energy level, or daily environment need?'
      },
      {
        title: 'Spirit',
        job: 'Your quiet inner intuition',
        question: 'What is your deeper soul or gut instinct quietly asking you to hear?'
      }
    ]
  }
];
