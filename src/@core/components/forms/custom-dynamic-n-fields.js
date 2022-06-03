import { Button, Grow, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const defItem = { answer: '', correct: false };

export const CustomDynamicNFields = ({
  form,
  field,
  label,
  defaultItems = null,
}) => {
  const [items, setItems] = useState(
    defaultItems && defaultItems.length > 0
      ? Object.fromEntries(defaultItems.map((e, ind) => [ind, e]))
      : {
          0: { ...defItem },
          1: { ...defItem },
        }
  );
  const error = form.formState.errors[field]?.message ?? '';
  const hasError = error !== '';

  const updateItem = (val, key) => {
    const newItems = { ...items };
    newItems[key] = {
      answer: val,
      correct: newItems[key]?.correct ?? false,
    };

    items = newItems;

    form.setValue(field, Object.values(newItems));
  };

  const addNewItem = () => {
    const newItems = { ...items };
    newItems[Math.max(...Object.keys(items)) + 1] = { ...defItem };

    setItems(newItems);
    form.setValue(field, Object.values(newItems));
  };

  const removeItem = (key) => {
    const newItems = { ...items };
    delete newItems[key];

    setItems(newItems);

    form.setValue(field, Object.values(newItems));
  };

  const setToCorrect = (correctKey) => {
    const newItems = {};
    for (const key in items) {
      newItems[key] = items[key];
      newItems[key].correct = correctKey == key;
    }

    setItems(newItems);

    form.setValue(field, Object.values(newItems));
  };

  return (
    <div className='mb-3'>
      <label
        className={`block uppercase ${
          hasError ? 'text-error-500' : 'text-primary-600'
        } mb-2 text-xs font-bold`}
      >
        {label}
      </label>

      <div className='mx-2 p-3'>
        <div className='mb-3'>
          {Object.keys(items).map((key, ind) => {
            return (
              <Grow
                key={ind}
                in={true}
                style={{ transformOrigin: '0 0 0' }}
                {...{ timeout: 300 }}
              >
                <div className='flex flex-row'>
                  {/* <label className='my-auto pr-3'>{ind + 1}</label> */}
                  <Tooltip title='Remove Answer'>
                    <IconButton
                      onClick={() => {
                        removeItem(key);
                      }}
                    >
                      <ClearIcon color='error' />
                    </IconButton>
                  </Tooltip>

                  <input
                    className={`${
                      !hasError ? 'border-0' : 'border-2 border-error-500'
                    } my-1 w-full rounded p-3 text-sm text-black shadow ring-primary transition-all duration-150 ease-linear focus:outline-none focus:ring`}
                    placeholder='Input'
                    defaultValue={items[key].answer}
                    onChange={(event) => {
                      const {
                        target: { value },
                      } = event;

                      updateItem(value, key);
                    }}
                  />

                  <Tooltip title='Mark as Correct Answer'>
                    <IconButton
                      onClick={() => {
                        setToCorrect(key);
                      }}
                    >
                      {items[key].correct ? (
                        <CheckCircleIcon color='success' />
                      ) : (
                        <CheckCircleOutlineIcon color='secondary' />
                      )}
                    </IconButton>
                  </Tooltip>
                </div>
              </Grow>
            );
          })}
        </div>

        <Tooltip title='Create more options'>
          <Button
            variant='outlined'
            color='secondary'
            size='small'
            startIcon={<AddIcon />}
            onClick={addNewItem}
          >
            Create
          </Button>
        </Tooltip>
      </div>

      {hasError && (
        <label className='text-xs text-error-500'>
          {error[0].toUpperCase() + error.slice(1)}
        </label>
      )}
    </div>
  );
};
