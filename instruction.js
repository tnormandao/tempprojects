            var Instruction = function( i1, i2 ){
                this.constructor = Instruction;
                this._S = [];
                if ( i1 && i2 && typeof i1 == 'string' && typeof i2 == 'function') {
                    this.add( i1, i2);
                } else if(i1 && !i2 && typeof i1 == 'function'){
                    this.add( i1 );
                }
            };
            Instruction.prototype.add = function(a1, a2){
                if (a1 && !a2 && typeof a1 == 'function'){
                    this._S.push( { n: 'f_'+this._S.length, f: a1 } );
                } else if ( a1 && a2 && typeof a1 == 'string' && typeof a2 == 'function') {
                    this._S.push( { n: a1, f: a2 } );
                }
            };
            Instruction.prototype.set = function(a1, a2){
                if ( a1 && a2 && typeof a1 == 'string' && typeof a2 == 'function') {
                    var fo = false;
                    if(this._S.length > 0){
                        for(var i = 0; i < this._S.length; i++){
                            if(this._S[i].n == a1) {
                                this._S[i] = { n: a1, f: a2 };
                                fo = true;
                            }
                            if( i == this._S.length-1 && !fo){
                                this.add( a1, a2);
                            }
                        }
                    } else {
                        this.add( a1, a2);
                    }
                } else if(a1 && !a2 && typeof a1 == 'function'){
                    this.add( a1 );
                }
            };
            Instruction.prototype.get = function(n){
                var N = (typeof n == 'string') ? 'n' : 'f';
                if(n){
                    for(var i = 0; i < this._S.length; i++){
                        if(this._S[i][N] == n){
                            return this._S[i].f;
                        }
                    }
                } else {
                    return this._S;
                }
                return false;
            };
            Instruction.prototype.drop = function(n){
                if(n){
                    var N = (typeof n == 'string') ? 'n' : 'f';
                    for(var i = 0; i < this._S.length; i++){
                        if(this._S[i][N] == n){
                            this._S.splice(i, 1);
                        }
                    }
                } else {
                    this._S = [];
                }
            };
            Instruction.prototype.run = function( t, ff, cb ){
                var t = t ? t : false, ff = ff ? ff : false;
                for(var i = 0; i < this._S.length; i++){
                    if(!ff){
                        this._S[i].f(t , this._S[i].n );
                    } else {
                        if( ff( this._S[i].n, i ) ){
                            this._S[i].f( t , this._S[i].n );
                        }
                    } if( cb && i == this._S.length-1){
                        cb();
                    }
                }
            };
