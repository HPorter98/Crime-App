                <input type='text' placeholder='Enter Location' onChange={this.handleInput}></input>
                <label>Select Radius (km)</label>
                <select onChange={this.handleRadius} placeholder='Select Radius'>
                    <option value={"0.25"}>0.25</option>
                    <option value={"0.50"}>0.50</option>
                    <option value={"1"}>1</option>
                    <option value={"1.5"}>1.5</option>
                    <option value={"2"}>2</option>
                </select>
                <button onClick={this.getLocation}>Find Crimes</button>