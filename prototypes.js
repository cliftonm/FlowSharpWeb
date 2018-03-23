// "Extension methods" 

Array.prototype.any = function (predicate) {
    for (var i = 0; i < this.length; i++) {
        if (predicate) {
            var any = predicate(this[i]);
            if (any) {
                return true;
            }
        }
    }

    return false;
}

/*

enumProto.any = function (predicate) {
            var any = false;
            this.forEach(function (elem, index) {
                if (predicate) {
                    any = predicate(elem, index);
                    return !any;
                }
                any = true;
                return false;
            });
            return any;
        };

*/