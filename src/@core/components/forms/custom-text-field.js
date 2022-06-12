export const CustomTextField = ({
  register,
  label,
  defaultValue = '',
  type = 'text',
  error = '',
}) => {
  const hasError = error !== '';

  return (
    <div className='relative mb-4 w-full'>
      <label
        className={`block uppercase ${
          hasError ? 'text-error-500' : 'text-primary-600'
        } mb-2 text-xs font-bold`}
      >
        {label}
      </label>
      <input
        type={type}
        // className={`${
        //   !hasError ? 'border-2 border-gray-500' : 'border-2 border-error-500'
        // } w-full rounded px-3 py-3 text-sm text-black ring-primary transition-all duration-150 ease-linear focus:border-0 focus:outline-none focus:ring-2`}
        className={`${
          !hasError ? 'border-2 border-gray-300' : 'border-2 border-error-500'
        } w-full rounded px-3 py-3 text-sm text-black shadow-sm outline-primary transition-all duration-150 ease-linear`}
        placeholder={label}
        defaultValue={defaultValue}
        disabled={!register}
        {...register}
      />
      {hasError && (
        <label className='text-xs text-error-500'>
          {error[0].toUpperCase() + error.slice(1)}
        </label>
      )}
    </div>
  );
};
