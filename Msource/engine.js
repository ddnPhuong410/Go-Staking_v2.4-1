
    function nFormatter(num, digits) {
        const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
        });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }
    async function updateUI(){
        const tokenMethod = document.getElementById("tokenStuff").value;
        document.getElementById("_yourBalance").innerHTML = nFormatter((await stakingRepcipient.methods.CheckBalanceOf(tokenMethod,_addUser).call())/Math.pow(10, Decimals),1);
        document.getElementById("_lastRewardCode").innerHTML = await stakingRepcipient.methods.yourLastRewardCode(_addUser).call();
        document.getElementById("_yourToken").innerHTML = nFormatter((await stakingRepcipient.methods.balanceOf(_addUser).call())/Math.pow(10, Decimals),2);
        document.getElementById("_yourReward").innerHTML = nFormatter((await stakingRepcipient.methods.yourReward(_addUser).call())/Math.pow(10, Decimals),2);
        document.getElementById("_busdBalance").innerHTML = nFormatter((await _BUSD.methods.balanceOf(_addRepcipient).call())/Math.pow(10, Decimals),6);
        document.getElementById("_usdtBalance").innerHTML = nFormatter((await _USDT.methods.balanceOf(_addRepcipient).call())/Math.pow(10, Decimals),6);
        const firtC = _addUser.substring(0,10) + "...";
        const lastC = _addUser.substring(35,42);
        document.getElementById("_yourAddress").innerHTML = firtC + lastC;
        const stakingPools = (await stakingRepcipient.methods.stakingPools().call())/Math.pow(10, Decimals);
        const totalSupply = (await stakingRepcipient.methods.totalSupply().call())/Math.pow(10, Decimals);
        document.getElementById("_stakingPools").innerHTML = nFormatter(stakingPools,6);
        document.getElementById("_tokenSupply").innerHTML = nFormatter(totalSupply,6);
        document.getElementById("_rewardBalance").innerHTML =  (await stakingRepcipient.methods.yourReward(_addUser).call())/Math.pow(10, Decimals);
        document.getElementById("_tokenB").innerHTML = (await stakingRepcipient.methods.balanceOf(_addUser).call())/Math.pow(10, Decimals) ;     
        const stakingRepcipientSymbol = await stakingRepcipient.methods.symbol().call()
        document.getElementById("_tokenSymbol1").innerHTML = stakingRepcipientSymbol
        document.getElementById("_tokenSymbol2").innerHTML = stakingRepcipientSymbol
        document.getElementById("_tokenSymbol3").innerHTML = stakingRepcipientSymbol
        document.getElementById("_yourMethod").innerHTML = tokenMethod;
        document.getElementById("_amount").value = '';
        load();
    }
//Here to Go    
    

    async function onClickButton(){
        const selectionOP = document.getElementById("staking_option").value;
        switch(selectionOP) {
            case "staking-to-token":
                gisStaking();
                break;
            case "withdraw-reward":
                withDraw();
                break;
            case "withdraw-token":
                withDrawToken();
                break;
            case "auth-deposit":
                authDeposit();
                break;
            default:
                goStaking();
          }
          
    }

    async function authDeposit(){
        const _amount = document.getElementById("_amount").value;
        const _opSelected = document.getElementById("staking_option").value;
        const num = _amount * Math.pow(10, Decimals);  
        const numAsHex = "0x" + num.toString(16); 
        const _symbolIP = document.getElementById("tokenStuff").value;
        if (_symbolIP == "BUSD"){
            const tx_hash = await _BUSD.methods.approve(_addRepcipient,numAsHex).send({'from': _addUser});
        } else{
            const tx_hash = await _USDT.methods.approve(_addRepcipient,numAsHex).send({'from': _addUser});
        } 
        await stakingRepcipient.methods.authDeposit(numAsHex,_symbolIP).send({'from': _addUser});
        updateUI();
    }

    async function goStaking(){ 
    
        const _amount = document.getElementById("_amount").value;
        const num = _amount * Math.pow(10, Decimals);  
        const numAsHex = "0x" + num.toString(16); 
        await stakingRepcipient.methods.GoStaking(numAsHex).send({'from': _addUser});
        updateUI();
       
    }
    async function gisStaking(){ 
        const _amount = document.getElementById("_amount").value;
        const _tokenSuff = document.getElementById("tokenStuff").value;
        const num = _amount * Math.pow(10, Decimals);  
        const numAsHex = "0x" + num.toString(16); 
        if (_tokenSuff == "BUSD"){
            const tx_hash = await _BUSD.methods.approve(_addRepcipient,numAsHex).send({'from': _addUser});
        } else {
            const tx_hash = await _USDT.methods.approve(_addRepcipient,numAsHex).send({'from': _addUser});
        }
        await stakingRepcipient.methods.BisStaking(numAsHex,_tokenSuff).send({'from': _addUser});
        updateUI();
    }
    
    async function withDraw(){
        const _draw = document.getElementById("_amount").value;
        const _tokenSuff = document.getElementById("tokenStuff").value;
        const _amountDraw = _draw * Math.pow(10, Decimals);
        const _amountDrawAsHex = "0x" + _amountDraw.toString(16); 
        await stakingRepcipient.methods.withdrawReward(_amountDrawAsHex,_tokenSuff).send({'from': _addUser});
        updateUI();
    }
    async function withDrawToken(){
        const _draw = document.getElementById("_amount").value;
        const _tokenSuff = document.getElementById("tokenStuff").value;
        const _amountDraw = _draw * Math.pow(10, Decimals);
        const _amountDrawAsHex = "0x" + _amountDraw.toString(16); 
        await stakingRepcipient.methods.withdrawToken(_amountDrawAsHex,_tokenSuff).send({'from': _addUser});
        updateUI();
    }
    async function readingInput(){
        const selectionOP = document.getElementById("staking_option").value;
        const _draw = document.getElementById("_amount").value;
        const _tokenSuff = document.getElementById("tokenStuff").value;
        var _tokenPB = 1;
        const _stakingPools = (await stakingRepcipient.methods.stakingPools().call())/Math.pow(10, Decimals);
        const _totalSupply = await stakingRepcipient.methods.totalSupply().call()/Math.pow(10, Decimals);
        if (_totalSupply ==0 || _stakingPools/_totalSupply < 1 ) {
            _tokenPB = 1;
        } else {
            _tokenPB = (_stakingPools/_totalSupply);
        }       
        
        switch(selectionOP) {
            case "staking-to-token":
                document.getElementById("_tokenEarn").innerHTML = nFormatter(_draw*95/100/_tokenPB,2);
                break;
            case "withdraw-reward":
                document.getElementById("_rewardBalance").innerHTML =  (await stakingRepcipient.methods.yourReward(_addUser).call())/Math.pow(10, Decimals) - _draw;
                break;
            case "withdraw-token":
                document.getElementById("_earnByToken").innerHTML = _draw*_tokenPB ;
                document.getElementById("_tokenB").innerHTML = (await stakingRepcipient.methods.balanceOf(_addUser).call())/Math.pow(10, Decimals) - _draw ;
                break;
            case "auth-deposit":
                if (_tokenSuff == "BUSD"){
                    document.getElementById("_deposit").innerHTML = (await _BUSD.methods.balanceOf(_addUser).call())/Math.pow(10, Decimals) - _draw ;
                }
                if (_tokenSuff == "USDT"){
                    document.getElementById("_deposit").innerHTML = (await _USDT.methods.balanceOf(_addUser).call())/Math.pow(10, Decimals) - _draw ;
                }
                
                break;
            default:
                break;
          }
    }
    
    async function loadweb3(){
        if (window.ethereum){
            w3 = new Web3(window.ethereum);
            window.ethereum.enable();
        }
    }
    async function loadPayments(){
        _abiBUSD = [
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "_decimals",
                "outputs": [
                    {
                        "internalType": "uint8",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "_name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "_symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "burn",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "internalType": "uint8",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getOwner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "mint",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "renounceOwnership",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];
        _addBUSD = '0x1FFEca0B9c26aCc903cCeE82BC460622039e14C4'; 
        _BUSD = await new w3.eth.Contract(_abiBUSD,_addBUSD);

        _addUSDT = '0x7074Ad5848f348365aaF5a2E67A7FE44fd1af06F'; 
        _USDT = await new w3.eth.Contract(_abiBUSD,_addUSDT);
        

        Decimals = await _BUSD.methods.decimals().call();
        _abiRepcipient = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_symbToken",
                        "type": "string"
                    }
                ],
                "name": "BisStaking",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_symbolCheck",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "_userAdd",
                        "type": "address"
                    }
                ],
                "name": "CheckBalanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    }
                ],
                "name": "GoStaking",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "ListPayableToken",
                "outputs": [
                    {
                        "internalType": "string[]",
                        "name": "",
                        "type": "string[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint32",
                        "name": "i",
                        "type": "uint32"
                    }
                ],
                "name": "TokenPayablebyID",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_addToken",
                        "type": "address"
                    }
                ],
                "name": "addPayList",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_symbToken",
                        "type": "string"
                    }
                ],
                "name": "authDeposit",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "burn",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint16",
                        "name": "_xNum",
                        "type": "uint16"
                    }
                ],
                "name": "checkxNum",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "internalType": "uint8",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "fixProjectStatus",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getOwner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "index",
                        "type": "uint256"
                    }
                ],
                "name": "removeTP",
                "outputs": [
                    {
                        "internalType": "string[]",
                        "name": "",
                        "type": "string[]"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "renounceOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "stakingPools",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint16",
                        "name": "_xNum",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint16",
                        "name": "_xMult",
                        "type": "uint16"
                    }
                ],
                "name": "updateXMult",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_symbToken",
                        "type": "string"
                    }
                ],
                "name": "withdrawReward",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_symbToken",
                        "type": "string"
                    }
                ],
                "name": "withdrawToken",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_user",
                        "type": "address"
                    }
                ],
                "name": "yourLastRewardCode",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_user",
                        "type": "address"
                    }
                ],
                "name": "yourReward",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];
        _addRepcipient ='0xc04Ad43B6484fd0A7A90415e3eBfd4e1719a9aBD';
        stakingRepcipient = await new w3.eth.Contract(_abiRepcipient,_addRepcipient);  
        _addUser = w3.currentProvider.selectedAddress;
        updateUI();
        
    }
    

    
    async function load(){
        await loadweb3();
        await loadPayments();
        console.log("Ready to Go!"); 
    }
    
    // load();