import { forwardRef, useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import LinkTool from '@editorjs/link';
import RawTool from '@editorjs/raw';
// import SimpleImage from '@editorjs/simple-image';
import ImageTool from '@editorjs/image';
import Checklist from '@editorjs/checklist';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import CodeTool from '@editorjs/code';
import Embed from '@editorjs/embed';

import { StyleInlineTool } from 'editorjs-style';
import Tooltip from 'editorjs-tooltip';
// import { CloudImage } from './UploadImage/CloudImage';
import _ from 'lodash/debounce';
import { usePostUploadApi } from 'src/utils/api';

const EDITTOR_HOLDER_ID = 'editorjs';

const CustomEditor = (props) => {
  const { setContent, content, setSaveContent, readOnly = false } = props;

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
  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITTOR_HOLDER_ID,
      data: JSON.parse(content === '' ? '{}' : content),
      placeholder: 'Let your beautiful idea flows here!',
      onReady: () => {
        console.log(editor);
        isInstance.current = editor;
      },
      readOnly,
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

        embed: {
          class: Embed,
          inlineToolbar: true,
          config: {
            services: {
              youtube: true,
              facebook: true,
            },
          },
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: '/api/fetch-url', // Your backend endpoint for url data fetching,
          },
        },
        checklist: Checklist,
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            withHeadings: true,
          },
        },
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

    setSaveContent({
      callback: async () => {
        console.log('setContent from callback');

        const output = await editor.save();
        const content = JSON.stringify(output);
        setContent(content);

        return content;
      },
    });
  };

  return (
    <div id='reset-this' className='Editor_class' style={{ width: '100%' }}>
      <div id={EDITTOR_HOLDER_ID} style={{ h1: {} }}></div>
    </div>
  );
};

export default CustomEditor;
