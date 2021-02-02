interface FabProps {
  onClick: () => void;
}

const styles: React.CSSProperties = {
  position: 'absolute',
  right: '10px',
  bottom: '10px',
  backgroundColor: '#38B2AC',
  color: '#DBDADC',
  height: '50px',
  width: '50px',
  borderRadius: '50%',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9,
};

export const Fab: React.FC<FabProps> = ({ onClick }) => {
  return (
    <div style={styles} onClick={onClick} className='fab' aria-label='add'>
      +
    </div>
  );
};
