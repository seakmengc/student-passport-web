export const CustomTextField = ({
  register,
  label,
  type = 'text',
  error = '',
}) => {
  const hasError = error !== '';

  return (
    <div className='relative mb-3 w-full'>
      <label
        className={`block uppercase ${
          hasError ? 'text-error-500' : 'text-primary-600'
        } mb-2 text-xs font-bold`}
      >
        {label}
      </label>
      <input
        type={type}
        className={`${
          !hasError ? 'border-0' : 'border-2 border-error-500'
        } w-full rounded px-3 py-3 text-sm text-black shadow ring-primary transition-all duration-150 ease-linear focus:outline-none focus:ring`}
        placeholder={label}
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
