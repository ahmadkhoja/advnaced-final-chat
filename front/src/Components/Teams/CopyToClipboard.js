import React from "react";
import { render } from "react-dom";
import CopyToClipboard from "react-copy-to-clipboard";
 
class CopyToClipboardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      copied: false
    }; 
  }
  onChange = e => {
    const value = e.target.value;
    this.setState({ value, copied: false });
  };
  onCopy = () => {
    this.setState({ copied: true });
  };

  render() {
    return (
      <div>
        <input value={this.state.value} size={10} onChange={this.onChange} />

        <CopyToClipboard text={this.state.value} onCopy={this.onCopy}>
          <button>Copy</button>
        </CopyToClipboard>

        <div>{this.state.copied ? <span>Copied.</span> : null}</div>
        <br />
      </div>
    );
  }
}
export default CopyToClipboardComponent;
