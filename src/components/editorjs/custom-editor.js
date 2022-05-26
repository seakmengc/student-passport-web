import React, { forwardRef, useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import LinkTool from '@editorjs/link';
import RawTool from '@editorjs/raw';
// import SimpleImage from '@editorjs/simple-image';
import ImageTool from '@editorjs/image';
import Checklist from '@editorjs/checklist';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import CodeTool from '@editorjs/code';
import { StyleInlineTool } from 'editorjs-style';
import Tooltip from 'editorjs-tooltip';
// import { CloudImage } from './UploadImage/CloudImage';
import _ from 'lodash/debounce';
import { usePostUploadApi } from 'src/utils/api';

const DEFAULT_INITIAL_DATA = () => {
  return {
    time: new Date().getTime(),
    blocks: [
      {
        id: '8FQQLWiDja',
        type: 'paragraph',
        data: { text: 'Start writing here !!!' },
      },
    ],
  };
};
const EDITTOR_HOLDER_ID = 'editorjs';

const CustomEditor = (props) => {
  const { setContent, content, setSaveContent } = props;

  const isInstance = useRef(undefined);

  /////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log('useEffect', new Date().toISOString());
    console.log({ isInstance, props });
    if (isInstance.current === undefined) {
      //To avoid init editor again
      isInstance.current = null;
      initEditor();
    }

    return () => {
      console.log('onDestroy', new Date().toISOString());
      if (isInstance.current) {
        console.log(isInstance.current);
        isInstance.current.destroy();
        isInstance.current = null;
      }
    };
  }, []);
  //////////////////////////////////////////////////////////////////////////////

  const onFileChange = async (file) => {
    const { data, error } = await usePostUploadApi(file);

    console.log({ data });

    return data.url;
  };

  //////////////////////////////////////////////////////////////////////////////////
  const initEditor = (readOnly = false) => {
    const editor = new EditorJS({
      holder: EDITTOR_HOLDER_ID,
      data: content === '' ? DEFAULT_INITIAL_DATA() : JSON.parse(content),
      placeholder: 'Write here!',
      readOnly: readOnly,
      onReady: () => {
        console.log(editor);
        isInstance.current = editor;
      },
      onChange: _(function () {
        try {
          contents();
        } catch (err) {}
      }, 3000),
      autofocus: true,
      tools: {
        style: StyleInlineTool,
        tooltip: {
          class: Tooltip,
          config: {
            location: 'left',
            highlightColor: '#FFEFD5',
            underline: true,
            backgroundColor: '#154360',
            textColor: '#FDFEFE',
            holder: 'editorId',
          },
        },

        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            defaultLevel: 1,
          },
        },

        raw: RawTool,
        linkTool: LinkTool,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                return onFileChange(file).then((imageUrl) => {
                  return {
                    success: 1,
                    file: {
                      url: imageUrl,
                    },
                  };
                });
              },
            },
          },
        },

        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: "Quote's author",
          },
        },
        code: {
          class: CodeTool,
          inlineToolbar: true,
        },
      },
    });

    async function contents() {
      console.log('setContent');
      const output = await editor.save();
      const content = JSON.stringify(output);
      setContent(content);
      console.log({ output });
    }

    setSaveContent({
      callback: () => {
        console.log('setContent from callback');
        contents();
      },
    });
  };

  function helloWorld() {
    console.log('Hello');
  }

  return (
    <div className='Editor_class' style={{ width: '100%' }}>
      <div id={EDITTOR_HOLDER_ID}></div>
    </div>
  );
};

export default CustomEditor;
