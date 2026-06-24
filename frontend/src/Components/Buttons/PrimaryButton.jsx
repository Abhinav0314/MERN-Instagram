function PrimaryButton({ btnName, onClick }) {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      {btnName}
    </button>
  );
}

export default PrimaryButton;
