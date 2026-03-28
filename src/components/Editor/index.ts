import WangEditor from './Editor';
import { IDomEditor } from '@wangeditor/editor';

export interface EditorExpose {
  getEditorRef: () => Promise<IDomEditor | null>;
}

export { WangEditor as Editor };
