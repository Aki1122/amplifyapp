import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
import {
  Button,
  CssBaseline,
  Divider,
  Link,
  Theme,
  ThemeProvider,
  Typography,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core';
import {
  ActionRequest,
  AudioActionResponse,
  ChatController,
  FileActionResponse,
  MuiChat,
} from 'chat-ui-react';

const initialFormState = { kinds: '', name: '', university: '', favorite: '', lecture: '',
  develop: '',environment: '',interested: '',review: '',impression: ''
};

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#007aff',
    },
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    backgroundColor: 'gray',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    maxWidth: '640px',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: theme.palette.background.default,
  },
  header: {
    padding: theme.spacing(1),
  },
  chat: {
    flex: '1 1 0%',
    minHeight: 0,
  },
  signout: {
    width : 200,
    marginLeft : 'auto',
  },
}));

var formData;
var setFormData;
var notes;
var setNotes;

  async function createNote() {
    //if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    /*if(formData.image){
      const image = await Storage.get(formData.image);
      formData.image = image;
    }*/
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
    alert(formData.name)
  }

export function App(): React.ReactElement {
  [notes, setNotes] = useState([]);
  [formData, setFormData] = useState(initialFormState);
  const classes = useStyles();
  const [chatCtl] = React.useState(
    new ChatController({
      showDateTime: false,
    }),
  );

  React.useMemo(() => {
    echo(chatCtl);
  }, [chatCtl]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className={classes.root}>
        <div className={classes.container}>
          <Typography className={classes.header}>
            東京電力アンケート
            <div className={classes.signout}>
              <AmplifySignOut />
            </div>
          </Typography>
          <Divider />
          <div className={classes.chat}>
            <MuiChat chatController={chatCtl} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

async function echo(chatCtl: ChatController): Promise<void> {
  await chatCtl.addMessage({
    type: 'text',
    content: `アンケートを選択してください`,
    self: false,
    avatar: '-',
  });
  const question = await chatCtl.setActionRequest({
    type: 'select',
    options: [
      {
        value: 'question',
        text: '研修アンケート',
      },
      {
        value: 'questionA',
        text: 'アンケートA',
      },
      {
        value: 'questionB',
        text: 'アンケートB',
      },
    ],
  });
  
  if(question.value == '研修アンケート')
  {
    await chatCtl.addMessage({
      type : 'text',
      content : '名前を入力してください',
      self:false,
      avatar:'-',
   });
    const name = await chatCtl.setActionRequest({
      type : 'text',
      placeholder : 'Please enter your name',
    });
    /*await chatCtl.addMessage({
      type: 'text',
      content: `You have entered:\n${name.value}`,
      self: false,
      avatar: '-',
    });*/
    
    await chatCtl.addMessage({
      type : 'text',
      content : '所属大学・専攻を入力してください',
      self:false,
      avatar:'-',
    });
    const univ = await chatCtl.setActionRequest({
      type: 'text',
      placeholder: '所属大学・専攻',
    });
    /*await chatCtl.addMessage({
      type: 'text',
      content: `You have entered:\n${univ.value}`,
      self: false,
      avatar: '-',
    });*/
  
    await chatCtl.addMessage({
      type: 'text',
      content: `好きな物を画像でお答えください`,
      self: false,
      avatar: '-',
    });
  
    const file = (await chatCtl.setActionRequest({
      type: 'file',
      accept: 'image/*',
      multiple: true,
    }));
  
    /*await chatCtl.addMessage({
      type: 'jsx',
      content: (
       <div>
          {file.files.map((f) => (
           <img
             key={file.files.indexOf(f)}
              src={window.URL.createObjectURL(f)}
              alt="File"
              style={{ width: '100%', height: 'auto' }}
            />
          ))}
        </div>
      ),
      self: false,
      avatar: '-',
    });*/

    await chatCtl.addMessage({
      type: 'text',
      content: `2日目午前の座学(DXについて)は分かりやすかったですか?`,
      self: false,
      avatar: '-',
    });
    const level_lec = await chatCtl.setActionRequest({
      type: 'select',
      options: [
        {
          value: 'easy',
          text: '分かりやすかった',
        },
        {
          value: 'normal',
          text: '普通',
        },
        {
          value: 'difficult',
          text: '難しかった',
        },
      ],
    });
    /*await chatCtl.addMessage({
      type: 'text',
      content: `You have selected ${level_lec.value}.`,
      self: false,
      avatar: '-',
    });*/
  
    await chatCtl.addMessage({
      type: 'text',
      content: `アプリ開発ではどう感じましたか?`,
      self: false,
      avatar: '-',
    });
    const level_dev = await chatCtl.setActionRequest({
      type: 'select',
      options: [
        {
          value: 'easy',
          text: '簡単だった',
        },
        {
          value: 'normal',
          text: '普通だった',
        },
       {
          value: 'difficult',
          text: '難しかった',
       },
      ],
    });
    /*await chatCtl.addMessage({
      type: 'text',
      content: `You have selected ${level_dev.value}.`,
      self: false,
      avatar: '-',
    });*/
  
    await chatCtl.addMessage({
      type: 'text',
      content: 'インターンシップの開催形式について教えて下さい',
      self: false,
      avatar: '-',
    });
    const sel = await chatCtl.setActionRequest({
      type: 'select',
      options: [
        {
          value: 'online',
          text: 'オンラインで良かった',
        },
        {
          value: 'offline',
          text: '対面で受けたかった',
        },
      ],
    });
    /*await chatCtl.addMessage({
      type: 'text',
      content: `You have selected ${sel.value}.`,
      self: false,
      avatar: '-',
    });*/

    await chatCtl.addMessage({
      type: 'text',
      content: `今回のインターンシップを通して、参考になった内容を教えて下さい(複数回答可)`,
      self: false,
      avatar: '-',
    });
    const mulSel = await chatCtl.setActionRequest({
      type: 'multi-select',
      options: [
        {
          value: 'class',
          text: 'DXについての説明',
        },
        {
          value: 'example',
          text: '社内での事例紹介',
        },
        {
          value: 'develop',
          text: 'アプリ開発',
        },
        {
          value: 'conference',
          text: '社員との懇談会',
        },
      ],
    });
    /*await chatCtl.addMessage({
      type: 'text',
      content: `You have selected '${mulSel.value}'.`,
      self: false,
      avatar: '-',
    });*/
  
    await chatCtl.addMessage({
      type: 'text',
      content: `インターンシップ全体を通してどのように感じましたか?`,
      self: false,
      avatar: '-',
    });
    const review = await chatCtl.setActionRequest({
      type: 'select',
    options: [
      {
        value: 'good',
        text: '満足',
      },
      {
        value: 'ok',
        text: '普通',
      },
      {
        value: 'not_good',
        text: 'いまいち',
      },
    ],
    });
    /*await chatCtl.addMessage({
      type: 'text',
      content: `You have selected ${review.value}.`,
      self: false,
      avatar: '-',
    });*/
  
    await chatCtl.addMessage({
      type : 'text',
      content : 'インターンシップ全体を通した感想を記入してください',
      self:false,
      avatar:'-',
    });
    const imp = await chatCtl.setActionRequest({
      type : 'text',
      placeholder : 'Please write your impression',
    });
    /*await chatCtl.addMessage({
      type: 'text',
      content: `You have entered:\n${imp.value}`,
      self: false,
      avatar: '-',
    });*/
  
    await chatCtl.addMessage({
      type: 'text',
      content: `氏名 : ${name.value}\n所属大学・専攻 : ${univ.value}\n好きなもの :\n`,
      self: false,
      avatar: '-',
    });
    await chatCtl.addMessage({
      type: 'jsx',
      content: (
        <div>
          {file.files.map((f) => (
            <img
              key={file.files.indexOf(f)}
              src={window.URL.createObjectURL(f)}
              alt="File"
              style={{ width: '100%', height: 'auto' }}
            />
          ))}
        </div>
      ),
      self: false,
      avatar: '-',
    });
    await chatCtl.addMessage({
      type: 'text',
      content: `2日目午前の座学(DXについて) : ${level_lec.value}\nアプリ開発 : ${level_dev.value}\nインターンシップの開催形式 : ${sel.value}\n参考になった内容 : ${mulSel.value}\nインターンシップの満足度 : ${review.value}\n感想:\n${imp.value}\n`,
      self: false,
      avatar: '-',
    });
  
    await chatCtl.addMessage({
      type: 'text',
      content: `よろしければ送信ボタンを押してください\n`,
      self: false,
      avatar: '-',
    });
    const confirm = await chatCtl.setActionRequest({
      type: 'select',
      options: [
        {
          value: 'send',
          text: '送信',
        },
        {
          value: 'more',
          text: 'もう一度',
        },
      ],
    });
  
    if(confirm.value == 'もう一度')
      echo(chatCtl);
    else
    {
      await chatCtl.addMessage({
        type: 'text',
        content: `ご回答ありがとうございました`,
        self: false,
        avatar: '-',
      });
      
      setFormData({ 
        'kinds':question.value,
        'name': name.value,
        'university':univ.value,
        'favorite':file.value,
        'lecture':level_lec.value,
        'develop':level_dev.value,
        'environment':sel.value,
        'interested':mulSel.value,
        'review':review.value,
        'impression':imp.value
      });
      createNote();
      
      
    }
  }
  else
  {
    await chatCtl.addMessage({
      type: 'text',
      content: `ご回答ありがとうございました`,
      self: false,
      avatar: '-',
    });
  }

  const buf = await chatCtl.setActionRequest({
    type: 'select',
    options: [
      {
        value: 'return',
        text: '一覧へ戻る',
      },
    ],
  });
  echo(chatCtl);
}

function GoodInput({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: ActionRequest;
}) {
  const chatCtl = chatController;

  const setResponse = React.useCallback((): void => {
    const res = { type: 'custom', value: 'Good!' };
    chatCtl.setActionResponse(actionRequest, res);
  }, [actionRequest, chatCtl]);

  return (
    <div>
      <Button
        type="button"
        onClick={setResponse}
        variant="contained"
        color="primary"
      >
        Good!
      </Button>
    </div>
  );
}

export default withAuthenticator(App);