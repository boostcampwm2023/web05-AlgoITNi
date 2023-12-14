import * as Y from 'yjs';

const TEXT_DATA = 'sharedText';

interface RelativePositon extends Y.RelativePosition {}
interface AbsolutePosition extends Y.AbsolutePosition {}

export interface CRDT {
  encodeData: () => Uint8Array;
  insert: (start: number, data: string) => void;
  delete: (start: number, removeLength: number) => void;
  update: (update: Uint8Array) => void;
  getRelativePosition: (position: number) => RelativePositon;
  getAbsolutePosition: (relativePositioni: RelativePositon) => AbsolutePosition | null;
}

export default class YjsCRDT implements CRDT {
  context: Y.Doc;

  constructor() {
    this.context = new Y.Doc();
  }

  encodeData() {
    return Y.encodeStateAsUpdate(this.context);
  }

  insert(start: number, data: string) {
    this.context.getText(TEXT_DATA).insert(start, data);
  }

  delete(start: number, removeLength: number) {
    this.context.getText(TEXT_DATA).delete(start, removeLength);
  }

  update(update: Uint8Array) {
    Y.applyUpdate(this.context, update);
  }

  toString() {
    return this.context.getText(TEXT_DATA).toString();
  }

  getRelativePosition(position: number): RelativePositon {
    return Y.createRelativePositionFromTypeIndex(this.context.getText(TEXT_DATA), position);
  }

  getAbsolutePosition(relativePosition: RelativePositon): AbsolutePosition | null {
    return Y.createAbsolutePositionFromRelativePosition(relativePosition, this.context);
  }
}
