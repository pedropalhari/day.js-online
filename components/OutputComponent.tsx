interface OutputComponentProps {
  value: string;
  id: number;
}

export default function OutputComponent(props: OutputComponentProps) {
  return (
    <div className="container">
      <div className="box">
        <span></span>
        <div
          style={{
            width: 700,
          }}
          className="content"
        >
          <p
            style={{
              borderBottom: "1px dotted #fff",
              width: "fit-content",
              height: "fit-content",
              fontWeight: "bold",
            }}
          >
            Output #{props.id}
          </p>
          <p>{props.value}</p>
        </div>
      </div>
    </div>
  );
}
