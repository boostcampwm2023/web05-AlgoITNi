export const SOCKET = {
  NAME_SPACE: 'signaling',
  MAXIMUM: 4,
};

export const SOCKET_EVENT = {
  JOIN_ROOM: 'join_room',
  ROOM_FULL: 'room_full',

  ALL_USERS: 'all_users',
  USER_EXIT: 'user_exit',
  DISCONNECT: 'disconnect',

  OFFER: 'offer',
  ANSWER: 'answer',
  CANDIDATE: 'candidate',
  GET_OFFER: 'getOffer',
  GET_ANSWER: 'getAnswer',
  GET_CANDIDATE: 'getCandidate',
};
